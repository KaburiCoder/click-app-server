import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HsUserService } from '../../modules/hs-user/hs-user.service';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { UserService } from '../user/user.service';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtService } from './auth-jwt.service';
import { plainToInstance } from 'class-transformer';
import { PayloadDto } from '@/shared/dto/payload.dto';
import { RefreshTokenService } from '@/modules/refresh-token/refresh-token.service';
import { UserDto } from '@/shared/dto/user.dto';
import { TokenResponseDto } from '@/shared/dto/token.response.dto';
import { GeoRangeParamDto } from './dto/geo-range.param.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hsUserSvc: HsUserService,
    private readonly userSvc: UserService,
    private readonly authJwtSvc: AuthJwtService,
    private readonly refreshTokenSvc: RefreshTokenService,
    private readonly jwtSvc: JwtService,
    private readonly mailSvc: MailService
  ) { }

  async getRoomKeyByHsUserId(userId: string) {
    const data = await this.hsUserSvc.findHsUserByUserId(userId);
    return { roomKey: data?.roomKey }
  }

  async signUp(dto: SignUpAuthDto) {
    const hsUser = await this.hsUserSvc.findHsUserByUserId(dto.hsUserId);

    if (!hsUser) {
      throw new BadRequestException("병원 계정이 존재하지 않습니다.");
    }

    const user = await this.userSvc.getUserByEmail(dto.email);
    if (user) {
      throw new UnauthorizedException("이미 존재하는 계정입니다.");
    }

    const { verifyToken, expiredAt } = await this.mailSvc.sendSignUpMail({ to: dto.email });
    return await this.userSvc.createUser({ ...dto, verifyToken, expiredAt });
  }

  async verifySignUp(token: string) {
    const user = await this.userSvc.getUserByVerifyToken(token);

    return user;
  }

  private async createTokens(obj: PayloadDto): Promise<TokenResponseDto> {
    const payload = plainToInstance(PayloadDto, obj, { excludeExtraneousValues: true });
    const { accessToken, refreshToken } = await this.authJwtSvc.createJwtTokens({ ...payload });

    return { user: payload, accessToken, refreshToken };
  }

  async signIn({ email, password }: SignInAuthDto): Promise<TokenResponseDto> {
    const user = await this.userSvc.verifyUser(email, password);

    if (!user?.isVerify) {
      throw new UnauthorizedException(`${user?.email} 메일로 인증이 완료되지 않았습니다.\n이메일 인증을 완료해 주세요.`);
    }
    const hsUser = await this.hsUserSvc.findHsUserByUserId(user.hsUserId);

    return this.createTokens({ ...user, orgName: hsUser?.orgName, roomKey: hsUser?.roomKey });
  }

  async refreshToken(accessToken: string): Promise<TokenResponseDto> {
    const data = await this.refreshTokenSvc.findOneByAccessToken(accessToken);
    if (!data) throw new UnauthorizedException("토큰이 만료되었습니다.");
    await this.refreshTokenSvc.deleteAccessToken(accessToken);
    let payload: PayloadDto;
    try {
      payload = this.jwtSvc.verify(data.refreshToken, { secret: process.env.JWT_RF_KEY! });
    } catch (ex) {
      throw ex;
    }

    return this.createTokens(payload);
  }

  async geoRange(hsUserId: string, dto: GeoRangeParamDto) {
    const distance = await this.hsUserSvc.findDistance(hsUserId, parseFloat(dto.lat), parseFloat(dto.lng));
    let message = "";

    if (!distance) {
      message = "위치정보를 확인할 수 없습니다.";
    } else if (distance > 5000) {
      message = "병원 거리가 5km 이상입니다.";
    }

    return { distance, message };
  }

  async createTestHsUser() {
    const hsUser = await this.hsUserSvc.createTestUser();
    return hsUser;
  }
}

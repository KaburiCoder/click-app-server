import { RefreshTokenService } from '@/modules/refresh-token/refresh-token.service';
import { PayloadDto } from '@/shared/dto/payload.dto';
import { TokenResponseDto } from '@/shared/dto/token.response.dto';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { HsUserService } from '../../modules/hs-user/hs-user.service';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { AuthJwtService } from './auth-jwt.service';
import { GeoRangeParamDto } from './dto/geo-range.param.dto';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hsUserSvc: HsUserService,
    private readonly userSvc: UserService,
    private readonly authJwtSvc: AuthJwtService,
    private readonly refreshTokenSvc: RefreshTokenService,
    private readonly jwtSvc: JwtService,
  ) { }

  async getRoomKeyByHsUserId(userId: string) {
    const data = await this.hsUserSvc.findHsUserByUserId(userId);
    return { roomKey: data?.roomKey }
  }

  async signUp({ hsUserId, csUserId, name, roomKey }: SignUpAuthDto) {
    const hsUser = await this.hsUserSvc.findHsUserByUserId(hsUserId);

    if (!hsUser) throw new BadRequestException("병원 계정이 존재하지 않습니다.");
    if (hsUser.roomKey !== roomKey) throw new BadRequestException("인증되지 않은 계정입니다.");

    const user = await this.userSvc.getUser(hsUserId, csUserId);
    if (user) throw new BadRequestException("이미 존재하는 계정입니다.");

    return await this.userSvc.createUser({ csUserId, name, roomKey, hsUserId });
  }

  // async verifySignUp(token: string) {
  //   const user = await this.userSvc.getUserByVerifyToken(token);

  //   return user;
  // }

  private async createTokens(obj: PayloadDto): Promise<TokenResponseDto> {
    const payload = plainToInstance(PayloadDto, obj, { excludeExtraneousValues: true });
    const { accessToken, refreshToken } = await this.authJwtSvc.createJwtTokens({ ...payload });

    return { user: payload, accessToken, refreshToken };
  }

  async signIn({ hsUserId, csUserId, roomKey }: SignInAuthDto): Promise<TokenResponseDto> {
    const hsUser = await this.hsUserSvc.findHsUserByUserId(hsUserId);

    if (!hsUser) throw new BadRequestException("병원 계정이 존재하지 않습니다.");
    if (hsUser.roomKey !== roomKey) throw new BadRequestException("인증되지 않은 계정입니다.");

    const user = await this.userSvc.getUser(hsUserId, csUserId);
    if (!user) throw new BadRequestException("사용자 계정이 존재하지 않습니다.");

    return this.createTokens({ ...user, orgName: hsUser?.orgName, roomKey });
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
    const { distance, allowedDistance } = await this.hsUserSvc.findDistance(hsUserId, parseFloat(dto.lat), parseFloat(dto.lng));
    let message = "";

    if (!distance) {
      message = "위치정보를 확인할 수 없습니다.";
    } else if (distance > allowedDistance) {
      message = `병원 거리가 ${allowedDistance}m를 벗어났습니다.\n현재 병원으로부터 거리: ${Math.round(distance)}m`;
    }

    return { distance, allowedDistance, message };
  }

  async createTestHsUser() {
    const hsUser = await this.hsUserSvc.createTestUser();
    return hsUser;
  }
}

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HsUserService } from '../../data-access/hs-user/hs-user.service';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { UserService } from '../user/user.service';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtService } from './auth-jwt.service';
import { plainToInstance } from 'class-transformer';
import { PayloadDto } from '@/shared/dto/payload.dto';
import { RefreshTokenService } from '@/domain/data-access/refresh-token/refresh-token.service';
import { UserDto } from '@/shared/dto/user.dto';
import { TokenResponseDto } from '@/shared/dto/token.response.dto';

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

  async signUp(dto: SignUpAuthDto) {
    const hsUser = await this.hsUserSvc.findHsUserByUserId(dto.hsUserId);

    if (!hsUser) {
      throw new NotFoundException("병원 계정이 존재하지 않습니다.");
    }

    const user = await this.userSvc.getUserByEmail(dto.email);
    if (user) {
      throw new BadRequestException("이미 존재하는 계정입니다.");
    }

    return await this.userSvc.createUser({ ...dto });
  }

  private async createTokens(obj: PayloadDto): Promise<TokenResponseDto> {
    const payload = plainToInstance(PayloadDto, obj, { excludeExtraneousValues: true });
    const { accessToken, refreshToken } = await this.authJwtSvc.createJwtTokens({ ...payload });

    return { user: payload, accessToken, refreshToken };
  }

  async signIn({ email, password }: SignInAuthDto): Promise<TokenResponseDto> {
    const user = await this.userSvc.verifyUser(email, password);
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
}
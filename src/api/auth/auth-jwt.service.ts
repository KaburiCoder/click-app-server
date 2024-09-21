import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '@/modules/refresh-token/refresh-token.service';
import { PayloadDto } from '@/shared/dto/payload.dto';

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly jwtSvc: JwtService,
    private readonly refreshTokenSvc: RefreshTokenService) { }

  async createJwtTokens(payload: PayloadDto) {
    const accessToken = await this.createAccessToken(payload);
    const refreshToken = await this.createRefreshToken(payload);

    await this.refreshTokenSvc.create(accessToken, refreshToken);
    return { accessToken, refreshToken };
  }

  private async createAccessToken(payload: PayloadDto) {
    return this.jwtSvc.signAsync(payload, {
      secret: process.env.JWT_KEY, expiresIn: process.env.JWT_EXP
    });
  }

  private async createRefreshToken(payload: PayloadDto) {
    return this.jwtSvc.signAsync(payload, {
      secret: process.env.JWT_RF_KEY, expiresIn: process.env.JWT_RF_EXP
    });
  }
}

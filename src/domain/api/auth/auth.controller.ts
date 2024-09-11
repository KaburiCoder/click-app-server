import { ZodValidate } from '@/common/decorators/zod-validate';
import { Body, Controller, Get, HttpCode, Param, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto, signUpSchema } from './dto/sign-up-auth.dto';
import { SignInAuthDto, signInSchema } from './dto/sign-in-auth.dto';
import { Response } from 'express'
import { CookieKey, CookieUtil } from '@/shared/utils/cookie.util';
import { RefreshTokenDto, refreshTokenSchema } from './dto/refresh-token.dto';
import { RefreshTokenService } from '@/domain/data-access/refresh-token/refresh-token.service';
import { Serialize } from '@/common/decorators/serialize';
import { TokenResponseDto } from '@/shared/dto/token.response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refeshTokenSvc: RefreshTokenService) { }

  private createTokenCookie(res: Response, { accessToken, refreshToken, user }: TokenResponseDto) {
    CookieUtil.of(CookieKey.refJwt).setCookie(res, refreshToken);

    return { user, accessToken }
  }

  @Post("signin")
  @HttpCode(200)
  @ZodValidate(signInSchema, TokenResponseDto)
  async signin(@Body() dto: SignInAuthDto, @Res({ passthrough: true }) res: Response) {
    const tokenResponse = await this.authService.signIn(dto);

    return this.createTokenCookie(res, tokenResponse);
  }

  @Post("signup")
  @ZodValidate(signUpSchema)
  signUp(@Body() dto: SignUpAuthDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(200)
  @Post("refresh-token")
  @ZodValidate(refreshTokenSchema)
  @Serialize(TokenResponseDto)
  async refreshToken(@Body() dto: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
    const tokenResponse = await this.authService.refreshToken(dto.accessToken);

    return this.createTokenCookie(res, tokenResponse);
  }

  @Get("roomKey/:hsUserId")
  async getRoomKey(@Param("hsUserId") hsUserId: string) {
    return this.authService.getRoomKeyByHsUserId(hsUserId);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  // }
}

import { CurrentUser } from '@/common/decorators/current-user';
import { Serialize } from '@/common/decorators/serialize';
import { ZodValidate } from '@/common/decorators/zod-validate';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { PayloadDto } from '@/shared/dto/payload.dto';
import { TokenResponseDto } from '@/shared/dto/token.response.dto';
import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post, Query, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GeoRangeParamDto, geoRangeParamSchema } from './dto/geo-range.param.dto';
import { RefreshTokenDto, refreshTokenSchema } from './dto/refresh-token.dto';
import { SignInAuthDto, signInSchema } from './dto/sign-in-auth.dto';
import { SignUpAuthDto, signUpSchema } from './dto/sign-up-auth.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles';
import { ConstantsService } from '@/constants/constants.service';

@UseGuards(RolesGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly constantsService: ConstantsService,
  ) { }

  @Post("signin")

  @HttpCode(200)
  @ZodValidate(signInSchema, TokenResponseDto)
  async signin(@Body() dto: SignInAuthDto, @Res({ passthrough: true }) res: Response) {
    const tokenResponse = await this.authService.signIn(dto);

    return { user: tokenResponse.user, accessToken: tokenResponse.accessToken }
  }

  @Post("signup")
  @ZodValidate(signUpSchema)
  signUp(@Body() dto: SignUpAuthDto) {
    return this.authService.signUp(dto);
  }

  @Post("refresh-token")
  @ZodValidate(refreshTokenSchema)
  @Serialize(TokenResponseDto)
  async refreshToken(@Body() dto: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
    const tokenResponse = await this.authService.refreshToken(dto.accessToken);

    return { user: tokenResponse.user, accessToken: tokenResponse.accessToken }
  }

  @Get("roomKey/:hsUserId")
  async getRoomKey(@Param("hsUserId") hsUserId: string) {
    return this.authService.getRoomKeyByHsUserId(hsUserId);
  }

  @Get("geo-range/:lat/:lng")
  @Roles("user")
  async geoRange(@CurrentUser() user: PayloadDto,
    @Param(new ZodValidationPipe(geoRangeParamSchema)) dto: GeoRangeParamDto) {
    return this.authService.geoRange(user.hsUserId, dto);
  }

  @Post("create-test-hs-user")
  async testCreateHsUser() {
    if (process.env.NODE_ENV !== 'test') {
      throw new BadRequestException("테스트 환경에서만 사용할 수 있는 기능입니다.");
    }
    return this.authService.createTestHsUser();
  }

  @Get("verify-signup")
  async verifySignUp(@Query("token") token: string, @Res() res: Response) {
    try {
      await this.authService.verifySignUp(token);
      res.redirect(this.constantsService.clientUrl + '/signin');
    } catch (ex) {
      res.redirect(this.constantsService.clientUrl + '/error?message=' + ex.message);
    }
  }
}

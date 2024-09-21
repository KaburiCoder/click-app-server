import { RefreshTokenModule } from '@/modules/refresh-token/refresh-token.module';
import { Module } from '@nestjs/common';
import { HsUserModule } from '../../modules/hs-user/hs-user.module';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { AuthJwtService } from './auth-jwt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [HsUserModule, UserModule, RefreshTokenModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, AuthJwtService],
  exports: [AuthService, AuthJwtService]
})
export class AuthModule { }

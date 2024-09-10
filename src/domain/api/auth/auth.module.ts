import { Module } from '@nestjs/common';
import { HsUserModule } from '../../data-access/hs-user/hs-user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthJwtService } from './auth-jwt.service';
import { RefreshTokenModule } from '@/domain/data-access/refresh-token/refresh-token.module';

@Module({
  imports: [HsUserModule, UserModule, RefreshTokenModule],
  controllers: [AuthController],
  providers: [AuthService, AuthJwtService],
  exports: [AuthService, AuthJwtService]
})
export class AuthModule { }

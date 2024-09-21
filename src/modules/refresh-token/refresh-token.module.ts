import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken, RefreshTokenSchema } from './entities/refresh-token.entity';
import { AuthJwtService } from '@/api/auth/auth-jwt.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
  ],
  providers: [RefreshTokenService, AuthJwtService],
  exports: [RefreshTokenService]
})
export class RefreshTokenModule { }

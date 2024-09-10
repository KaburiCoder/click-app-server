import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './jwt.config';
@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    JwtModule.registerAsync({ useClass: JwtConfig, global: true }),
  ],
})
export class ConfigModule { }
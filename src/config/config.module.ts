import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './configs/jwt.config';
import { EnvModule } from './env/env.module';

@Module({
  imports: [
    EnvModule,
    JwtModule.registerAsync({ useClass: JwtConfig, global: true }),],

})
export class ConfigModule { }
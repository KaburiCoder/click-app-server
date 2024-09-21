import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) { }
  get MONGODB_HS_URL(): string {
    return this.configService.get<string>('MONGODB_HS_URL')!;
  }

  get JWT_KEY(): string {
    return this.configService.get<string>('JWT_KEY')!;
  }

  get JWT_RF_KEY(): string {
    return this.configService.get<string>('JWT_RF_KEY')!;
  }

  get JWT_EXP(): string {
    return this.configService.get<string>('JWT_EXP')!;
  }

  get JWT_RF_EXP(): string {
    return this.configService.get<string>('JWT_RF_EXP')!;
  }

  get MONGODB_URL(): string {
    return this.configService.get<string>('MONGODB_URL')!;
  }

  get NODE_ENV(): string {
    return this.configService.get<string>('NODE_ENV')!;
  }

  get MAIL_SERVICE(): string {
    return this.configService.get<string>('MAIL_SERVICE')!;
  }

  get MAIL_HOST(): string {
    return this.configService.get<string>('MAIL_HOST')!;
  }

  get MAIL_PORT(): number {
    return this.configService.get<number>('MAIL_PORT')!;
  }

  get MAIL_USER(): string {
    return this.configService.get<string>('MAIL_USER')!;
  }

  get MAIL_PASS(): string {
    return this.configService.get<string>('MAIL_PASS')!;
  } 
}

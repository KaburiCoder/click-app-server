import { EnvService } from '@/config/env/env.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConstantsService {
  constructor(private readonly env: EnvService) { }

  get isProduction(): boolean {
    return this.env.NODE_ENV === 'production';
  }

  get baseUrl(): string {
    return this.isProduction ? 'https://app.click-soft.co.kr' : 'http://localhost:3000';
  }

  get clientUrl(): string {
    return this.isProduction ? 'https://app.click-soft.co.kr' : 'http://localhost:5173';
  }
}

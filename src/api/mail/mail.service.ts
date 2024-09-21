import { EnvService } from '@/config/env/env.service';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SignUpMailDto } from './dto/send-mail.dto';
import { signUpMailHtml } from './html/sign-up-mail.html';
import { MailerService } from './mailer.service';
import { ConstantsService } from '@/constants/constants.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly constants: ConstantsService
  ) { }

  async sendSignUpMail(dto: SignUpMailDto) {
    const token = randomUUID();

    const html = signUpMailHtml(
      `${this.constants.baseUrl}/images/click_soft_logo.png`,
      `${this.constants.baseUrl}/api/auth/verify-signup?token=${token}`
    );

    await this.mailerService.sendMail({
      subject: "클릭 앱 회원가입 인증 메일",
      html,
      to: dto.to,
    });

    return {
      verifyToken: token,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 1) // 1시간
    }
  }
}

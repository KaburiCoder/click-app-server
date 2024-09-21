import { EnvService } from '@/config/env/env.service';
import { Injectable } from '@nestjs/common';
import * as mailer from "nodemailer";
import * as util from "util";
const inLineCss = require("nodemailer-juice");

@Injectable()
export class MailerService {
  constructor(private readonly env: EnvService) { }

  private getTransporter() {
    const transport = {
      service: this.env.MAIL_SERVICE,
      host: this.env.MAIL_HOST,
      port: this.env.MAIL_PORT,
      auth: {
        user: this.env.MAIL_USER,
        pass: this.env.MAIL_PASS,
      },
    }

    const transporter = mailer.createTransport(transport);

    transporter.use("compile", inLineCss());

    return transporter;
  }

  async sendMail({ subject, html, to }: { subject: string, html: string, to: string }) {
    const transporter = this.getTransporter();
    const sendMailAsync = util
      .promisify(transporter.sendMail)
      .bind(transporter);

    await sendMailAsync({
      from: this.env.MAIL_USER, // 네이버 아이디
      to, // 수신자 아이디
      subject,
      html,
    });

    transporter.close();
  }
}

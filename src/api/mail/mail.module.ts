import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerService } from './mailer.service';

@Module({
  controllers: [MailController],
  providers: [MailService, MailerService],
  exports: [MailService, MailerService]
})
export class MailModule { }

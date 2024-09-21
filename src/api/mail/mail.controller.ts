import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SignUpMailDto } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Post("signup")
  sendSignUpMail(@Body() dto: SignUpMailDto) {
    return this.mailService.sendSignUpMail(dto);
  }
}


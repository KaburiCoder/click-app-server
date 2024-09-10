import { Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { PayloadDto } from '@/shared/dto/payload.dto';
import { CurrentUser } from '@/common/decorators/current-user';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  currentUser(@CurrentUser() user: PayloadDto): PayloadDto {
    console.log('currentUser');

    if (!user) throw new UnauthorizedException("권한 없음");
    return user;
  }
}

import { CurrentUser } from '@/common/decorators/current-user';
import { Serialize } from '@/common/decorators/serialize';
import { PayloadDto } from '@/shared/dto/payload.dto';
import { Controller, Get, Param, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  currentUser(@CurrentUser() user: PayloadDto): PayloadDto {
    console.log('currentUser');

    if (!user) throw new UnauthorizedException("권한 없음");
    return user;
  }

  @Get('/:hsUserId')
  async getUsersByHsUserId(@Param('hsUserId') hsUserId: string) {
    const users = await this.userService.getUsersByHsUserId(hsUserId);
    return { users };
  }
}


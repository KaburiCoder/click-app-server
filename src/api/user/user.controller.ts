import { CurrentUser } from '@/common/decorators/current-user';
import { PayloadDto } from '@/shared/dto/payload.dto';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GetWebAppUserRequest, GetWebAppUserResponse } from './dto/get-web-app-user.dto';
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

  @GrpcMethod('WebAppUserService', 'GetWebAppUser')
  async getWebAppUser({ hsUserId }: GetWebAppUserRequest, metadata: Metadata, call: ServerUnaryCall<GetWebAppUserRequest, GetWebAppUserResponse>) {
    const users = await this.userService.getUsersByHsUserId(hsUserId);
    return { users: users };
  }

  // @Get('/:hsUserId')
  // async getUsersByHsUserId(@Param('hsUserId') hsUserId: string) {
  //   const users = await this.userService.getUsersByHsUserId(hsUserId);
  //   return { users };
  // }
}


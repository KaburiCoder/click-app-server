import { CurrentUser } from '@/common/decorators/current-user';
import { PayloadDto } from '@/shared/dto/payload.dto';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller, Get, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GetWebAppUsersRequest, GetWebAppUsersResponse } from './dto/get-web-app-users.dto';
import { UserService } from './user.service';
import { GrpcLoggingInterceptor } from '@/common/interceptors/grpc-logging.interceptor';
import { DeleteWebAppUserRequest } from './dto/delete-web-app-user';
import { WebAppUser } from './dto/web-app-user';

@UseInterceptors(GrpcLoggingInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  currentUser(@CurrentUser() user: PayloadDto): PayloadDto {
    console.log('currentUser');

    if (!user) throw new UnauthorizedException("권한 없음");
    return user;
  }

  @GrpcMethod('WebAppUserService', 'GetWebAppUsers')
  async getWebAppUser({ hsUserId }: GetWebAppUsersRequest, metadata: Metadata, call: ServerUnaryCall<GetWebAppUsersRequest, GetWebAppUsersResponse>) {
    const users = await this.userService.getUsersByHsUserId(hsUserId);
    return { users: users };
  }

  @GrpcMethod('WebAppUserService', 'DeleteWebAppUser')
  async deleteWebAppUser({ id }: DeleteWebAppUserRequest, metadata: Metadata, call: ServerUnaryCall<DeleteWebAppUserRequest, WebAppUser>) {
    const user = await this.userService.deleteWebAppUser(id);
    return user;
  }

  // @Get('/:hsUserId')
  // async getUsersByHsUserId(@Param('hsUserId') hsUserId: string) {
  //   const users = await this.userService.getUsersByHsUserId(hsUserId);
  //   return { users };
  // }
}


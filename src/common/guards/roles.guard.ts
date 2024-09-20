import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesType } from '../decorators/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RolesType[]>('roles', context.getHandler());
    const role = roles?.[0];
    if (!role) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.currentUser;

    if (role === "user" || role === "admin") {
      if (!user) throw new UnauthorizedException();
    }

    return true;
  }
}


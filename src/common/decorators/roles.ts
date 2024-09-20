import { SetMetadata } from '@nestjs/common';

export type RolesType = "admin" | "user";

export const Roles = (roles: RolesType) => {
  return SetMetadata('roles', [roles]);
};
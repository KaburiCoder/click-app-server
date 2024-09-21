import { User } from "@/api/user/entities/user.entity";
import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";

export class UserDto extends OmitType(User, ['isVerify']) {
  @Expose()
  id?: string;
  @Expose()
  createdAt?: Date;
  @Expose()
  updatedAt?: Date;
}


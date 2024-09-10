import { User } from "@/domain/api/user/entities/user.entity";
import { Exclude, Expose } from "class-transformer";

export class UserDto extends User {
  @Expose()
  id?: string;
  @Expose()
  createdAt?: Date;
  @Expose()
  updatedAt?: Date;
}


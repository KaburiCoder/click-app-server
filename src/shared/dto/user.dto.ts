import { User } from "@/api/user/entities/user.entity";
import { Expose } from "class-transformer";

export class UserDto extends User {
  @Expose()
  id?: string;
  @Expose()
  createdAt?: Date;
  @Expose()
  updatedAt?: Date;
}


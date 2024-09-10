import { Expose } from "class-transformer";
import { UserDto } from "./user.dto";

export class PayloadDto extends UserDto {  
  iat?: number;
  exp?: number;
  @Expose()
  orgName?: string;
  @Expose()
  roomKey?: string;
}

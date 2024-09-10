import { Exclude } from "class-transformer";
import { PayloadDto } from "./payload.dto";

export class TokenResponseDto {
  accessToken: string;
  @Exclude()
  refreshToken: string;
  user?: PayloadDto;
}
import { z } from "zod";

export const refreshTokenSchema = z.object({
  accessToken: z.string(),
});

export class RefreshTokenDto {
  accessToken: string;
}
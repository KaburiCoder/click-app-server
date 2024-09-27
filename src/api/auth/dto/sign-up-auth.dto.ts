import { z } from "zod";

export const signUpSchema = z.object({
  hsUserId: z.string(),
  csUserId: z.string(),
  name: z.string(),
  roomKey: z.string(),
});

export type SignUpAuthDto = z.infer<typeof signUpSchema>;
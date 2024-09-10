import { z } from "zod";

export const signUpSchema = z.object({
  hsUserId: z.string(),
  csUserId: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export type SignUpAuthDto = z.infer<typeof signUpSchema>;
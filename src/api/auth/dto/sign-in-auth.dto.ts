import { z } from "zod";

export const signInSchema = z.object({
  hsUserId: z.string().min(1),
  csUserId: z.string().min(1),
  roomKey: z.string().min(1),  
});

export type SignInAuthDto = z.infer<typeof signInSchema>;
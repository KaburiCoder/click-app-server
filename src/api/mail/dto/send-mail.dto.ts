// zod
import { z } from 'zod';

export const SignUpMailDtoSchema = z.object({
  to: z.string().email(),
});

export interface SignUpMailDto extends z.infer<typeof SignUpMailDtoSchema> {
  to: string;
}

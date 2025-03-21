import { z } from 'zod';

export const vsWriteMenuSchema = z.object({
  key: z.string(),
  order: z.number(),
});

export const upsertUserSettingsSchema = z.object({
  vsWriteMenus: z.array(vsWriteMenuSchema).optional(),
  changeSearchDateToIbwonDate: z.boolean().optional(),
});

export class UpsertUserSettingsDto {
  vsWriteMenus?: {
    key: string;
    order: number;
  }[];
  changeSearchDateToIbwonDate?: boolean;
}

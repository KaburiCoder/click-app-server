import { z } from 'zod';

export const geoRangeParamSchema = z.object({
  lat: z.string().regex(/^[-+]?[0-9]*\.?[0-9]+$/).refine(val => parseFloat(val) >= -90 && parseFloat(val) <= 90, "Latitude must be between -90 and 90"),
  lng: z.string().regex(/^[-+]?[0-9]*\.?[0-9]+$/).refine(val => parseFloat(val) >= -180 && parseFloat(val) <= 180, "Longitude must be between -180 and 180"),
});

export interface GeoRangeParamDto extends z.infer<typeof geoRangeParamSchema> { }
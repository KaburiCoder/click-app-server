import { CorsOptions, CorsOptionsDelegate } from "@nestjs/common/interfaces/external/cors-options.interface";

export const corsConfig: CorsOptions | CorsOptionsDelegate<any> = {
  origin: ["http://localhost:5173", "http://localhost:3010", 'https://app.click-soft.co.kr'],
  credentials: true,
};
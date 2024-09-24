import { CorsOptions, CorsOptionsDelegate } from "@nestjs/common/interfaces/external/cors-options.interface";

export const corsConfig: CorsOptions | CorsOptionsDelegate<any> = {
  origin: [
    "http://localhost:3010",
    "http://localhost:3020",
    "http://localhost:5173",
    'https://app.click-soft.co.kr',
    "https://hs.click-soft.co.kr",
  ],
  credentials: true,
};
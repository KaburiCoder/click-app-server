declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URL: string;
    MONGODB_HS_URL: string;
    JWT_KEY: string;
    JWT_RF_KEY: string;
    JWT_EXP: string;
    JWT_RF_EXP: string;
  }
}
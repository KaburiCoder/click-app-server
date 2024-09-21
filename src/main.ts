import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/configs/cors.config';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  app.setGlobalPrefix('api');
  app.use("/", express.static(path.join(__dirname, "..", "public")));

  app.enableCors(corsConfig)
  await app.listen(3000);
}
bootstrap();

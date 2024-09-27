import { RunApp, RunGrpcServer } from "./app";

async function bootstrap() {
  await RunApp();
  await RunGrpcServer();
}

bootstrap();

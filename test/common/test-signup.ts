import { SignUpAuthDto } from '@/api/auth/dto/sign-up-auth.dto';
import * as request from 'supertest'
import { app } from 'test/e2e/setup';

export const testSignup = async () => {
  await request(app.getHttpServer())
    .post("/auth/create-test-hs-user")
    .expect(201);

  const response = await request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      name: "클릭",
      csUserId: "csUser",
      hsUserId: "hsUser",
      roomKey: "roomKey",

    } satisfies SignUpAuthDto)
    .expect(201);

  return response.body;
}
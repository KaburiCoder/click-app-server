import { SignUpAuthDto } from '@/api/auth/dto/sign-up-auth.dto';
import * as request from 'supertest'
import { app } from 'test/e2e/setup';

export const testSignup = async () => {
  const response = await request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      email: "test@test.com",
      password: "abc",
      name: "클릭",
      csUserId: "csUser",
      hsUserId: "hsUser"
    } satisfies SignUpAuthDto)
    .expect(201);

  return response.body;
}
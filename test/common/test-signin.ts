import { SignInAuthDto } from '@/api/auth/dto/sign-in-auth.dto';
import * as request from 'supertest';
import { app } from 'test/e2e/setup';

export const testSignin = async ({ hsUserId = "hsUser", csUserId = "csUser", roomKey = "roomKey" }: Partial<SignInAuthDto>) => {
  const response = await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ hsUserId, csUserId, roomKey } satisfies SignInAuthDto)
    .expect(200);

  return {
    accessToken: response.body.accessToken,
    user: response.body.user,
  };
}
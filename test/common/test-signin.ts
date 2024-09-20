import { SignInAuthDto } from '@/domain/api/auth/dto/sign-in-auth.dto';
import * as request from 'supertest';
import { app } from 'test/e2e/setup';

export const testSignin = async ({ email = "test@test.com", password = "abc" }: Partial<SignInAuthDto>) => {
  const response = await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email, password } satisfies SignInAuthDto)
    .expect(200);

  return {
    accessToken: response.body.accessToken,
    user: response.body.user,
  };
}
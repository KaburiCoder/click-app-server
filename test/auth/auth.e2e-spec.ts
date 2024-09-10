import { RefreshTokenDto } from '@/domain/api/auth/dto/refresh-token.dto';
import * as request from 'supertest';
import { testSignin } from 'test/common/test-signin';
import { testSignup } from 'test/common/test-signup';
import { app, setupTestEnvironment, teardownTestEnvironment } from 'test/e2e/setup';

describe('Auth (e2e)', () => {
  beforeAll(async () => {
    await setupTestEnvironment()
  });

  afterAll(async () => {
    await teardownTestEnvironment()
  });

  it('/signup (Post)', async () => {
    await testSignup();
  });

  it('/signin & /refresh-token (Post)', async () => {
    const { accessToken } = await testSignin({});


    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh-token')
      .send({ accessToken } satisfies RefreshTokenDto)
      .expect(200);

    expect(response.body.accessToken).toBeDefined();
  });

  it('/roomKey/:hsUserId (Get)', async () => {
    const hsUserId = "clickUser";
    const response = await request(app.getHttpServer())
      .get(`/api/auth/roomKey/${hsUserId}`)
      .expect(200);

    expect(response.body.roomKey).toBe("roomKey");
  });
});

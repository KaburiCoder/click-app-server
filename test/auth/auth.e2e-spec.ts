import { RefreshTokenDto } from '@/api/auth/dto/refresh-token.dto';
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
      .post('/auth/refresh-token')
      .send({ accessToken } satisfies RefreshTokenDto)
      .expect(201);

    expect(response.body.accessToken).toBeDefined();
  });

  it('/roomKey/:hsUserId (Get)', async () => {
    const hsUserId = "hsUser";
    const response = await request(app.getHttpServer())
      .get(`/auth/roomKey/${hsUserId}`)
      .expect(200);

    expect(response.body.roomKey).toBe("roomKey");
  });

  it('/geo-range/:lat/:lng (Get)', async () => {
    const { accessToken } = await testSignin({});

    const response = await request(app.getHttpServer())
      .get('/auth/geo-range/35.842124211057545/127.02538426007262')
      .set("Authorization", `Bearer ${accessToken}`).expect(200);

    expect(response.body.distance).toBeLessThan(5000);
  });
});

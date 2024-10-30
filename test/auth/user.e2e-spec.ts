import * as request from 'supertest';
import { testSignin } from 'test/common/test-signin';
import { testSignup } from 'test/common/test-signup';
import { app, setupTestEnvironment, teardownTestEnvironment } from 'test/e2e/setup';

describe('User (e2e)', () => {
  beforeAll(async () => {
    await setupTestEnvironment()
  });

  afterAll(async () => {
    await teardownTestEnvironment()
  });

  it('/ (Get)', async () => {
    await testSignup();
    const { accessToken } = await testSignin({});

    const response = await request(app.getHttpServer())
      .get('/user')
      .set("Authorization", `Bearer ${accessToken}`).expect(200);

    expect(response.body.hsUserId).toBe("hsUser");
  });

  // it('/api/user/:hsUserId (Get)', async () => {
  //   const hsUserId = 'hsUser';
  //   const response = await request(app.getHttpServer())
  //     .get(`/user/${hsUserId}`)
  //     .expect(200);

  //   expect(response.body.users).toBeDefined();
  // });
});

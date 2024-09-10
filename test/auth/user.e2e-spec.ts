import { RefreshTokenDto } from '@/domain/api/auth/dto/refresh-token.dto';
import { SignInAuthDto } from '@/domain/api/auth/dto/sign-in-auth.dto';
import { SignUpAuthDto } from '@/domain/api/auth/dto/sign-up-auth.dto';
import { HsUserService } from '@/domain/data-access/hs-user/hs-user.service';
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
      .get('/api/user')
      .set("Authorization", `Bearer ${accessToken}`).expect(200);

      expect( response.body.email).toBe("test@test.com");
  });
});

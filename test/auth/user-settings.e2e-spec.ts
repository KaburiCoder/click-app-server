import { UpsertUserSettingsDto, upsertUserSettingsSchema } from '@/api/user-settings/dto/upsert-user.dto';
import * as request from 'supertest';
import { testSignin } from 'test/common/test-signin';
import { testSignup } from 'test/common/test-signup';
import { app, teardownTestEnvironment, setupTestEnvironment } from "test/e2e/setup";

describe('UserSettings (e2e)', () => {
  let userId: string;
  let accessToken: string;

  beforeAll(async () => {
    await setupTestEnvironment()
  });

  afterAll(async () => {
    await teardownTestEnvironment()
  });


  it('/user-settings/:userId (Get)', async () => {
    await testSignup();
    const { accessToken: token, user } = await testSignin({});

    userId = user.id;
    accessToken = token;
    const response = await request(app.getHttpServer())
      .get(`/user-settings/${userId}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it('/user-settings/:userId (Put)', async () => {
    const body: UpsertUserSettingsDto = {
      vsWriteMenus: [{ key: 'hulap2', order: 1 }, { key: 'hulap1', order: 2 }]
    };

    const response = await request(app.getHttpServer())
      .put(`/user-settings/${userId}`)
      .send(body)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.vsWriteMenus).toEqual(body.vsWriteMenus);
  });

  it('/user-settings/:userId (Put) - 순번 변경', async () => {
    const body: UpsertUserSettingsDto = {
      vsWriteMenus: [{ key: 'hulap1', order: 1 }, { key: 'hulap2', order: 2 }]
    };

    const response = await request(app.getHttpServer())
      .put(`/user-settings/${userId}`)
      .send(body)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.vsWriteMenus).toEqual(body.vsWriteMenus);
  });
});
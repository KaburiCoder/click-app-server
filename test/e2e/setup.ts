import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from '@/app.module';
import { HsUserService } from '@/domain/data-access/hs-user/hs-user.service';

export let app: INestApplication;
export let mongod: MongoMemoryServer;

interface MockProvider {
  provide: any;
  useValue: any;
}

export const setupTestEnvironment = async (mockProviders: MockProvider[] = []) => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  const moduleBuilder = Test.createTestingModule({
    imports: [
      MongooseModule.forRoot(uri),
      AppModule,
    ],
  });
  moduleBuilder.overrideProvider(HsUserService).useValue({
    findHsUserByUserId: jest.fn().mockResolvedValue({
      userId: "clickUser",
      orgName: 'clicksoft',
      roomKey: 'roomKey',
    })
  });
  mockProviders.forEach(mockProvider =>
    moduleBuilder.overrideProvider(mockProvider.provide).useValue(mockProvider.useValue),
  )

  const moduleFixture: TestingModule = await moduleBuilder.compile();


  app = moduleFixture.createNestApplication();
  await app.init();
};

export const teardownTestEnvironment = async () => {
  await app.close();
  await mongod.stop();
};
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from '@/app.module';

export let app: INestApplication;
let mongodDefault: MongoMemoryServer;
let mongodHs: MongoMemoryServer;

export const setupTestEnvironment = async () => {
  // 두 개의 MongoMemoryServer 인스턴스를 생성
  mongodDefault = await MongoMemoryServer.create();
  mongodHs = await MongoMemoryServer.create();

  const uriDefault = mongodDefault.getUri();  // 기본 연결용 URI
  const uriHs = mongodHs.getUri();  // Hs 연결용 URI

  const moduleBuilder = Test.createTestingModule({
    imports: [
      // 기본 연결에 대한 Mongoose 설정
      MongooseModule.forRoot(uriDefault),
      
      // Hs 연결에 대한 Mongoose 설정 (connectionName 사용)
      MongooseModule.forRoot(uriHs, { connectionName: 'hs' }),
      
      AppModule,
    ],
  });

  const moduleFixture: TestingModule = await moduleBuilder.compile();

  app = moduleFixture.createNestApplication();
  await app.init();
};

export const teardownTestEnvironment = async () => {
  await app.close();
  await mongodDefault.stop();
  await mongodHs.stop();
};

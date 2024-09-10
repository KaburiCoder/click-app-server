import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './mongo/mongoose.config';
import { HsMongooseConfig } from './mongo/hs-mongoose.config';
import { MongoConNames } from '@/constants/database/mongo-con-names';

@Module({
  imports: [
    MongooseModule.forRootAsync({ useClass: MongooseConfig }),
    MongooseModule.forRootAsync({ useClass: HsMongooseConfig, connectionName: MongoConNames.hs }),
  ]
})
export class DatabaseModule { }

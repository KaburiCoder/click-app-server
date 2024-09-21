import { MongoConNames } from '@/constants/database/mongo-con-names';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HsMongooseConfig } from './mongo/hs-mongoose.config';
import { MongooseConfig } from './mongo/mongoose.config';

@Module({
  imports: [    
    MongooseModule.forRootAsync({ useClass: MongooseConfig }),
    MongooseModule.forRootAsync({ useClass: HsMongooseConfig, connectionName: MongoConNames.hs }),
  ],
})
export class DatabaseModule { }

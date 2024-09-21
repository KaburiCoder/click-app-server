import { Module } from '@nestjs/common';
import { HsUserService } from './hs-user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HsUser, HsUserSchema } from './entities/hs-user.entity';
import { MongoConNames } from '@/constants/database/mongo-con-names';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: HsUser.name, schema: HsUserSchema
    }], MongoConNames.hs),
  ],
  providers: [HsUserService],
  exports: [HsUserService]
})
export class HsUserModule { }

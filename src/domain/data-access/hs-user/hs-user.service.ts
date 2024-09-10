import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HsUser } from './entities/hs-user.entity';
import { Model } from 'mongoose';
import { MongoConNames } from '@/constants/database/mongo-con-names';

@Injectable()
export class HsUserService {
  constructor(@InjectModel(HsUser.name, MongoConNames.hs) private hsUser: Model<HsUser>) { }

  async findHsUserByUserId(userId: string) {
    return await this.hsUser.findOne({ userId }).exec();
  }
}

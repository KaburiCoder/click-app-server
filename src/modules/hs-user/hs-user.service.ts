import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HsUser } from '../../database/entities/hs-user.entity';
import { Model } from 'mongoose';
import { MongoConNames } from '@/constants/database/mongo-con-names';

@Injectable()
export class HsUserService {
  constructor(
    @InjectModel(HsUser.name, MongoConNames.hs)
    private hsUser: Model<HsUser>) { }

  async findHsUserByUserId(userId: string) {
    return await this.hsUser.findOne({ userId })
      .collation({ locale: 'en', strength: 2 }).exec();
  }

  async findDistance(userId: string, lat: number, lng: number): Promise<number | null> {
    const result = await this.hsUser.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat]
          },
          distanceField: "distance",  // 1000 미터 이내
          spherical: true
        },
      },
      {
        $project: {
          userId: 1,
          distance: 1,
        }
      },
      {
        $match: {
          userId
        }
      }
    ]).exec();


    return result?.[0]?.distance;
  }

  async createTestUser() {
    const hsUser = await this.hsUser.create({
      email: "clickUser@clicksoft.co.kr",
      userId: "hsUser",
      name: "clickUser",
      password: "1234",
      orgName: "clicksoft",
      roomKey: "roomKey",
      location: {
        type: "Point",
        coordinates: [127.01538426007262, 35.832124211057545]
      }
    });

    return hsUser;
  }
}

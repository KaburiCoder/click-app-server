import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import { Model } from 'mongoose';
import { RefreshToken } from '../../database/entities/refresh-token.entity';

@Injectable()
export class RefreshTokenService { 
  constructor(
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>) { }

  async create(accessToken: string, refreshToken: string) {
    const refeshToken = new this.refreshTokenModel({ accessToken, refreshToken, expiredAt: dayjs().add(2, "day").toDate() })
    return await refeshToken.save();
  }

  async findOneByAccessToken(accessToken: string) {
    return await this.refreshTokenModel.findOne({ accessToken }).exec();
  }

  async deleteAccessToken(accessToken: string) {
    return await this.refreshTokenModel.findOneAndDelete({accessToken}).exec();    
  }
}

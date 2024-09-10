import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './entities/refresh-token.entity';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs'
import { AuthJwtService } from '@/domain/api/auth/auth-jwt.service';
import { UserDto } from '@/shared/dto/user.dto';
import { plainToInstance } from 'class-transformer';

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

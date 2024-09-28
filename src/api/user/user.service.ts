import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserArgs } from './args/create-user.args';
import { WebAppUser } from './dto/web-app-user';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user: Model<User>) { }

  async getUsersByHsUserId(hsUserId: string): Promise<WebAppUser[]> {
    var users = await this.user.find({ hsUserId }).exec();
    return users.map(user => ({ id: user.id, csUserId: user.csUserId, name: user.name }));
  }

  async getUser(hsUserId: string, csUserId: string) {
    const user = await this.user.findOne({ hsUserId, csUserId })
      .collation({ locale: 'en', strength: 2 })
      .exec();
    return user?.toJSON();
  }

  async getUserByEmail(email: string) {
    const user = await this.user.findOne({ email }).exec();

    return user?.toJSON();
  }

  async createUser(args: CreateUserArgs): Promise<User> {
    const newUser = new this.user({ ...args });

    return newUser.save();
  }

  async deleteWebAppUser(id: string) {
    return await this.user.findByIdAndDelete(id).exec();
  }

  // async getUserByVerifyToken(token: string): Promise<User> {
  //   const user = await this.user.findOne({ verifyToken: token });

  //   if (!user) {
  //     throw new UnauthorizedException("토큰이 만료되었습니다.");
  //   }
  //   user.verifyToken = undefined;
  //   user.expiredAt = undefined;

  //   await user.save();

  //   return user;
  // }
}

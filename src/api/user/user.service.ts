import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserArgs } from './args/create-user.args';
import { GetUserDto } from './dto/get-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user: Model<User>) { }

  async getUsersByHsUserId(hsUserId: string): Promise<GetUserDto[]> {
    var users = await this.user.find({ hsUserId }).exec();
    return users.map(user => ({ csUserId: user.csUserId, name: user.name, email: user.email }));
  }

  async getUserByEmail(email: string) {
    const user = await this.user.findOne({ email }).exec();

    return user?.toJSON();
  }

  async createUser(args: CreateUserArgs): Promise<User> {
    const newUser = new this.user({ ...args });

    return newUser.save();
  }

  async verifyUser(email: string, password: string) {
    const user = await this.getUserByEmail(email);

    if (!user) throw new NotFoundException("아이디 혹은 비밀번호를 확인하세요.");

    const isVerified = await bcrypt.compare(password, user.password);

    if (!isVerified) throw new NotFoundException("아이디 혹은 비밀번호를 확인하세요.");

    return user;
  }

  async getUserByVerifyToken(token: string): Promise<User> {
    const user = await this.user.findOne({ verifyToken: token });

    if (!user) {
      throw new UnauthorizedException("토큰이 만료되었습니다.");
    }
    user.verifyToken = undefined;
    user.expiredAt = undefined;

    await user.save();

    return user;
  }
}

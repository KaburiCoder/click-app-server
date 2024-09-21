import { UserDto } from '@/shared/dto/user.dto';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserArgs } from './args/create-user.args';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    return user?.toJSON();
  }

  async createUser(args: CreateUserArgs): Promise<User> {
    const newUser = new this.userModel({ ...args });

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
    const user = await this.userModel.findOne({ verifyToken: token });

    if (!user) {
      throw new UnauthorizedException("토큰이 만료되었습니다.");
    }
    user.verifyToken = undefined;
    user.expiredAt = undefined;

    await user.save();

    return user;
  }
}

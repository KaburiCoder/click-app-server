import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { CreateUserArgs } from './args/create-user.args';
import * as bcrypt from 'bcrypt'
import { UserDto } from '@/shared/dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user?.toJSON() as User;
  }

  async createUser(args: CreateUserArgs): Promise<User> {
    const newUser = new this.userModel({ ...args });

    return newUser.save();
  }

  async verifyUser(email: string, password: string): Promise<UserDto> {
    const user = await this.getUserByEmail(email);

    const newException = () => {
      new NotFoundException("아이디 혹은 비밀번호를 확인하세요.");
    }

    if (!user) throw new NotFoundException("아이디 혹은 비밀번호를 확인하세요.");

    const isVerified = await bcrypt.compare(password, user.password);

    if (!isVerified) throw new NotFoundException("아이디 혹은 비밀번호를 확인하세요.");

    return user;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSettings } from '@/database/entities/user-settings.entity';
import { UpsertUserSettingsDto } from './dto/upsert-user.dto';

@Injectable()
export class UserSettingsService {

  constructor(
    @InjectModel(UserSettings.name) private userSettingsModel: Model<UserSettings>,
  ) { }

  async getUserSettings(userId: string) {
    return this.userSettingsModel.findOne({ userId }).exec();
  }

  async upsertUserSettings(userId: string, body: UpsertUserSettingsDto) {
    const { vsWriteMenus } = body;

    let userSettings = await this.getUserSettings(userId);

    // 저장된 설정이 없으면 생성
    if (!userSettings) {
      userSettings = new this.userSettingsModel({ userId, ...body });
      return (await userSettings.save()).toJSON();
    }

    // 설정 업데이트
    if (vsWriteMenus) {
      userSettings.vsWriteMenus = vsWriteMenus;
    }

    return (await userSettings.save()).toJSON();
  }
}

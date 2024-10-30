import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UpsertUserSettingsDto, upsertUserSettingsSchema } from './dto/upsert-user.dto';
import { ZodValidate } from '@/common/decorators/zod-validate';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { Roles } from '@/common/decorators/roles';
import { RolesGuard } from '@/common/guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) { }

  @Get(':userId')
  async getUserSettings(@Param('userId') userId: string) {
    return this.userSettingsService.getUserSettings(userId);
  }

  @Put(':userId')
  @Roles("user")
  async upsertUserSettings(@Param('userId') userId: string, @Body(new ZodValidationPipe(upsertUserSettingsSchema)) body: UpsertUserSettingsDto) {
    return this.userSettingsService.upsertUserSettings(userId, body);
  }
}


import { Roles } from '@/common/decorators/roles';
import { RolesGuard } from '@/common/guards/roles.guard';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UpsertUserSettingsDto, upsertUserSettingsSchema } from './dto/upsert-user.dto';
import { UserSettingsService } from './user-settings.service';

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


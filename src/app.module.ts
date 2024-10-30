import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import * as cookieParser from 'cookie-parser';
import { globalFilterProviders } from './common/filters/global-filter-providers';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { HsUserModule } from './modules/hs-user/hs-user.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { CurrentUserMiddleware } from './common/middlewares/current-user.middleware';
import { MailModule } from './api/mail/mail.module';
import { EnvModule } from './config/env/env.module';
import { ConstantsModule } from './constants/constants.module';
import { UserSettingsModule } from './api/user-settings/user-settings.module';

@Module({
  imports: [EnvModule, ConfigModule, DatabaseModule, UserModule, AuthModule, HsUserModule, RefreshTokenModule, MailModule, ConstantsModule, UserSettingsModule],
  controllers: [AppController],
  providers: [...globalFilterProviders, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser()).forRoutes("*")
      .apply(CurrentUserMiddleware).forRoutes("*");
    // consumer
    //   .apply(CurrentUserMiddleware)
    //   .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

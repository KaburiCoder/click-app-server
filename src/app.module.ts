import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import * as cookieParser from 'cookie-parser';
import { globalFilterProviders } from './common/filters/global-filter-providers';
import { UserModule } from './domain/api/user/user.module';
import { AuthModule } from './domain/api/auth/auth.module';
import { HsUserModule } from './domain/data-access/hs-user/hs-user.module';
import { RefreshTokenModule } from './domain/data-access/refresh-token/refresh-token.module';
import { CurrentUserMiddleware } from './common/middlewares/current-user.middleware';

@Module({
  imports: [ConfigModule, DatabaseModule, UserModule, AuthModule, HsUserModule, RefreshTokenModule],
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

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { LoggerConfig } from './config/logger.config';
import appConfig from './config/app.config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filter/all.exception.filter';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { FileModule } from './modules/file/file.module';
import { CountryModule } from './modules/country/country.module';
import { TaskModule } from './modules/task/task.module';
import ormConfig = require('./config/ormconfig');
import { PaymentModule } from './modules/payment/payment.module';
import { RawBodyMiddleware } from './common/middleware/raw-body.middleware';
import { JsonBodyMiddleware } from './common/middleware/json-body.middleware';
import { MessageModule } from './modules/message/message.module';
import { MessageWebTestModule } from './modules/message-web-test/message-web-test.module';
import { AdminModule } from './modules/admin/admin.module';
import { PushModule } from './modules/push/push.module';

@Module({
  imports: [
    LoggerModule.forRoot(new LoggerConfig().config),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRoot(ormConfig[0]),
    AuthModule,
    UserModule,
    FileModule,
    CountryModule,
    TaskModule,
    PaymentModule,
    MessageModule,
    MessageWebTestModule,
    AdminModule,
    PushModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({
        path: '/payment/webhook',
        method: RequestMethod.POST,
      })
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
  }
}

import { Module } from '@nestjs/common';
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
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OrmConfig } from './config/ormconfig';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from "nestjs-pino";
import { LoggerConfig } from './config/logger.config';


@Module({
  imports: [
    LoggerModule.forRoot(new LoggerConfig().config),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(new OrmConfig().config[0]),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

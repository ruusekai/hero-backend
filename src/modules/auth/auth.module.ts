import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from "../user/user.service";
import { MySqlRepositoryModule } from "../../database/mysql/repositories/mysql.repository.module";
import { AuthController } from "./auth.controller";

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    MySqlRepositoryModule,
  ],
  providers: [AuthService, LocalStrategy, UserService],
  exports: [AuthService],
})
export class AuthModule {}

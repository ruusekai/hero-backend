import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';
import { UserManager } from './user.manager';

@Module({
  imports: [MySqlRepositoryModule],
  controllers: [UserController],
  providers: [UserManager, UserService],
  exports: [UserService],
})
export class UserModule {}

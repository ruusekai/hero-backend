import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';
import { UserManager } from './user.manager';
import { AuthModule } from '../auth/auth.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [MySqlRepositoryModule, AuthModule, WalletModule],
  controllers: [UserController],
  providers: [UserManager, UserService],
  exports: [UserService],
})
export class UserModule {}

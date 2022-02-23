import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';
import { WalletManager } from './wallet.manager';

@Module({
  imports: [MySqlRepositoryModule],
  controllers: [WalletController],
  providers: [WalletManager, WalletService],
  exports: [WalletService],
})
export class WalletModule {}

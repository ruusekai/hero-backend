import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';

@Module({
  imports: [MySqlRepositoryModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}

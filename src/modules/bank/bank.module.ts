import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';
import { BankManager } from './bank.manager';

@Module({
  controllers: [BankController],
  imports: [MySqlRepositoryModule],
  providers: [BankManager, BankService],
})
export class BankModule {}

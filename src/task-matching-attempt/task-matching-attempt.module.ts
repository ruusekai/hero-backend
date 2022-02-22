import { Module } from '@nestjs/common';
import { TaskMatchingAttemptService } from './task-matching-attempt.service';
import { TaskMatchingAttemptController } from './task-matching-attempt.controller';
import { TaskMatchingAttemptManager } from './task-matching-attempt.manager';
import { MySqlRepositoryModule } from '../database/mysql/repositories/mysql.repository.module';
import { PushModule } from '../modules/push/push.module';
import { MessageModule } from '../modules/message/message.module';
import { PaymentModule } from '../modules/payment/payment.module';
import { WalletModule } from '../modules/wallet/wallet.module';

@Module({
  imports: [
    MySqlRepositoryModule,
    PushModule,
    MessageModule,
    PaymentModule,
    WalletModule,
  ],
  controllers: [TaskMatchingAttemptController],
  providers: [TaskMatchingAttemptManager, TaskMatchingAttemptService],
  exports: [TaskMatchingAttemptService],
})
export class TaskMatchingAttemptModule {}

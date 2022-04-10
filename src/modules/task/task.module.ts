import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskManager } from './task.manager';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentUtilModule } from '../../utils/payment/payment.util.module';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';
import { PushModule } from '../push/push.module';
import { TaskMatchingAttemptModule } from '../task-matching-attempt/task-matching-attempt.module';
import { PaymentModule } from '../payment/payment.module';
import { EmailUtilModule } from '../../utils/email/email.util.module';

@Module({
  imports: [
    MySqlRepositoryModule,
    ConfigModule,
    UserModule,
    PaymentUtilModule,
    MessageModule,
    PushModule,
    TaskMatchingAttemptModule,
    PaymentModule,
    EmailUtilModule,
  ],
  controllers: [TaskController],
  providers: [TaskManager, TaskService],
  exports: [TaskService],
})
export class TaskModule {}

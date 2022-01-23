import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskManager } from './task.manager';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { PaymentUtilModule } from '../../utils/payment/payment.util.module';

@Module({
  imports: [MySqlRepositoryModule, ConfigModule, PaymentUtilModule],
  controllers: [TaskController],
  providers: [TaskManager, TaskService, UserService],
})
export class TaskModule {}

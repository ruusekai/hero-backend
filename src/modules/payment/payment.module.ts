import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentManager } from './payment.manager';
import { UserModule } from '../user/user.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [UserModule, TaskModule],
  controllers: [PaymentController],
  providers: [PaymentManager, PaymentService],
})
export class PaymentModule {}

import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentManager } from './payment.manager';

@Module({
  controllers: [PaymentController],
  providers: [PaymentManager, PaymentService],
})
export class PaymentModule {}

import { Module } from '@nestjs/common';
import { PaymentUtil } from './payment.util';

@Module({
  imports: [],
  providers: [PaymentUtil],
  exports: [PaymentUtil],
})
export class PaymentUtilModule {}

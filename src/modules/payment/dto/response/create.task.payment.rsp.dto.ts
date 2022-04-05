import { PaymentIntent } from '../../../../database/mysql/entities/payment.intent.entity';

export class CreateTaskPaymentRspDto {
  constructor(
    ephemeralKey: string,
    paymentIntentClientSecret: string,
    publishableKey: string,
    details: PaymentIntent,
  ) {
    this.ephemeralKey = ephemeralKey;
    this.paymentIntentClientSecret = paymentIntentClientSecret;
    this.publishableKey = publishableKey;
    this.details = details;
  }
  ephemeralKey: string;
  paymentIntentClientSecret: string;
  publishableKey: string;
  details: PaymentIntent;
}

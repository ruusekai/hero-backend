import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { PaymentIntent } from '../entities/payment.intent.entity';

@EntityRepository(PaymentIntent)
@Injectable()
export class PaymentIntentRepository extends Repository<PaymentIntent> {
  constructor() {
    super();
  }

  async findOnePaymentIntentByStripePaymentIntentIdAndIsDeletedFalse(
    stripePaymentIntentId: string,
  ): Promise<PaymentIntent> {
    try {
      return await this.findOne({
        stripePaymentIntentId: stripePaymentIntentId,
        isDeleted: false,
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async savePaymentIntent(
    PaymentIntent: PaymentIntent,
  ): Promise<PaymentIntent> {
    try {
      PaymentIntent.updatedDate = new Date(Date.now());
      return await this.save(PaymentIntent);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

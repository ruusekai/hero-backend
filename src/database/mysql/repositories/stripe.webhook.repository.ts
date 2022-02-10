import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { StripeWebhook } from '../entities/stripe.webhook.entity';

@EntityRepository(StripeWebhook)
@Injectable()
export class StripeWebhookRepository extends Repository<StripeWebhook> {
  constructor() {
    super();
  }

  async saveStripeWebhook(
    StripeWebhook: StripeWebhook,
  ): Promise<StripeWebhook> {
    try {
      StripeWebhook.updatedDate = new Date(Date.now());
      return await this.save(StripeWebhook);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

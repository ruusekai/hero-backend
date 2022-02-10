import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import Stripe from 'stripe';
import { User } from '../../database/mysql/entities/user.entity';

@Injectable()
export class PaymentUtil {
  private readonly logger = new Logger(PaymentUtil.name);
  private readonly stripe;
  private readonly taskMinChargeAmt;
  private readonly taskPlatformChargePercentage;
  private readonly taskMinHeroRewardPercentage;
  private readonly webhookEndpointSecret;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>(
      'payment.STRIPE_SECRET_KEY',
    );
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2020-08-27',
    });
    this.taskMinChargeAmt = Number(
      this.configService.get<string>('payment.TASK_MINIMUM_CHARGE_AMT'),
    );
    this.taskPlatformChargePercentage =
      Number(
        this.configService.get<string>(
          'payment.TASK_PLATFORM_CHARGE_PERCENTAGE',
        ),
      ) / 100;
    this.taskMinHeroRewardPercentage =
      Number(
        this.configService.get<string>(
          'payment.TASK_MINIMUM_HERO_REWARD_PERCENTAGE',
        ),
      ) / 100;
    this.webhookEndpointSecret = this.configService.get<string>(
      'payment.STRIPE_WEBHOOK_ENDPOINT_SECRET',
    );
  }

  async createStripeCustomer(user: User) {
    try {
      const customer: Stripe.Customer = await this.stripe.customers.create({
        email: user.email,
        phone: user.mobile,
        metadata: { user_uuid: user.uuid },
      });
      this.logger.log('customer created, id: ' + customer.id);
      return customer;
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_7007_STRIPE_ERROR, e);
    }
  }

  async verifyTotalChargeAmt(
    basicCostAmt: number,
    heroRewardAmt: number,
    serviceChargeAmt: number,
    totalChargeAmt: number,
  ) {
    //hero報酬不可低於任務成本5%
    if (basicCostAmt * this.taskMinHeroRewardPercentage > heroRewardAmt) {
      throw new ApiException(ResponseCode.STATUS_7004_INVALID_HERO_REWARD_AMT);
    }

    //平台手續費 = 總成本 * 5%（最低為$10）
    //總數 = 總成本 + 平台手續費
    const totalCost = basicCostAmt + heroRewardAmt;
    const calcServiceCharge: number =
      totalCost * this.taskPlatformChargePercentage < this.taskMinChargeAmt
        ? this.taskMinChargeAmt
        : totalCost * this.taskPlatformChargePercentage;
    if (calcServiceCharge.toFixed(2) != serviceChargeAmt.toFixed(2)) {
      throw new ApiException(ResponseCode.STATUS_7001_INVALID_TOTAL_CHARGE_AMT);
    } else if (
      (totalCost + serviceChargeAmt).toFixed(2) != totalChargeAmt.toFixed(2)
    ) {
      throw new ApiException(ResponseCode.STATUS_7001_INVALID_TOTAL_CHARGE_AMT);
    }
    return true;
  }

  async createStripePaymentIntentWithCreditHold(
    amount: number,
    stripeCustomerId: string,
    userUuid: string,
    taskUuid: string,
  ) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'hkd',
        payment_method_types: ['card'],
        capture_method: 'manual',
        customer: stripeCustomerId,
        metadata: { user_uuid: userUuid, task_uuid: taskUuid },
      });
      return paymentIntent;
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_7007_STRIPE_ERROR, e);
    }
  }

  async webhookConstructEvent(webhookBody, sig) {
    try {
      return await this.stripe.webhooks.constructEvent(
        webhookBody,
        sig,
        this.webhookEndpointSecret,
      );
    } catch (e) {
      this.logger.error(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_7009_STRIPE_INVALID_WEBHOOK);
    }
  }

  async retrievePaymentIntent(paymentIntentId: string) {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (e) {
      this.logger.error(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_7009_STRIPE_INVALID_WEBHOOK);
    }
  }

  async capturePaymentIntent(paymentIntentId: string, amount: number) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.capture(
        paymentIntentId,
        { amount_to_capture: amount },
      );
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_7007_STRIPE_ERROR, e);
    }
  }
}

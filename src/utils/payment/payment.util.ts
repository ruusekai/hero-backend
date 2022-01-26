import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import Stripe from 'stripe';

@Injectable()
export class PaymentUtil {
  private readonly logger = new Logger(PaymentUtil.name);
  private readonly stripe;
  private readonly taskMinChargeAmt;
  private readonly taskChargePercentage;

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
    this.taskChargePercentage = Number(
      this.configService.get<string>('payment.TASK_COST_CHARGE_PERCENTAGE'),
    );
  }

  async createCustomer() {
    const customer: Stripe.Customer = await this.stripe.customers.create();
    this.logger.log('customer created, id: ' + customer.id);
    return customer;
  }

  async verifyTotalChargeAmt(
    basicCostAmt: number,
    heroRewardAmt: number,
    serviceChargeAmt: number,
    totalChargeAmt: number,
  ) {
    const totalCost = basicCostAmt + heroRewardAmt;
    const calcServiceCharge: number =
      (totalCost * this.taskChargePercentage) / 100 < this.taskMinChargeAmt
        ? this.taskMinChargeAmt
        : (totalCost * this.taskChargePercentage) / 100;
    if (calcServiceCharge.toFixed(2) != serviceChargeAmt.toFixed(2)) {
      throw new ApiException(ResponseCode.STATUS_7001_INVALID_TOTAL_CHARGE_AMT);
    } else if (
      (totalCost + serviceChargeAmt).toFixed(2) != totalChargeAmt.toFixed(2)
    ) {
      throw new ApiException(ResponseCode.STATUS_7001_INVALID_TOTAL_CHARGE_AMT);
    }
    return true;
  }
}

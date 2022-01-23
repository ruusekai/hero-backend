import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';

@Injectable()
export class PaymentUtil {
  private readonly logger = new Logger(PaymentUtil.name);
  private readonly taskMinChargeAmt;
  private readonly taskChargePercentage;

  constructor(private readonly configService: ConfigService) {
    this.taskMinChargeAmt = Number(
      this.configService.get<string>('payment.TASK_MINIMUM_CHARGE_AMT'),
    );
    this.taskChargePercentage = Number(
      this.configService.get<string>('payment.TASK_COST_CHARGE_PERCENTAGE'),
    );
  }

  async verifyTotalChargeAmt(
    basicCostAmt: number,
    heroRewardAmt: number,
    totalChargeAmt: number,
  ) {
    const totalCost = basicCostAmt + heroRewardAmt;
    const shouldChargeAmt: number =
      (totalCost * this.taskChargePercentage) / 100 < this.taskMinChargeAmt
        ? this.taskMinChargeAmt
        : (totalCost * this.taskChargePercentage) / 100;
    if (totalChargeAmt.toFixed(2) != shouldChargeAmt.toFixed(2)) {
      throw new ApiException(ResponseCode.STATUS_5001_INVALID_TOTAL_CHARGE_AMT);
    }
    return true;
  }
}

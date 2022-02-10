import { Injectable, Logger } from '@nestjs/common';
import { UserCoupon } from '../../database/mysql/entities/user.coupon.entity';
import { UserService } from '../user/user.service';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { CouponType } from './enum/coupon.type';
import { CreateTaskPaymentReqDto } from './dto/create.task.payment.req.dto';
import { PaymentIntentRepository } from '../../database/mysql/repositories/payment.intent.repository';
import { PaymentIntent } from '../../database/mysql/entities/payment.intent.entity';
import { StripeWebhook } from '../../database/mysql/entities/stripe.webhook.entity';
import { StripeWebhookRepository } from '../../database/mysql/repositories/stripe.webhook.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly userService: UserService,
    private readonly paymentIntentRepository: PaymentIntentRepository,
    private readonly stripeWebhookRepository: StripeWebhookRepository,
  ) {}

  private readonly logger = new Logger(PaymentService.name);

  create(createPaymentDto: CreateTaskPaymentReqDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  async verifyUserCoupon(
    userUuid: string,
    userCouponUuid: string,
    couponDiscountAmt: number,
  ) {
    const userCoupon: UserCoupon = await this.userService.findActiveUserCoupon(
      userUuid,
      userCouponUuid,
    );
    if (userCoupon == null) {
      throw new ApiException(ResponseCode.STATUS_7002_INVALID_USER_COUPON);
    }
    this.logger.log('userCoupon:' + JSON.stringify(userCoupon));
    if (userCoupon.coupon.type === CouponType.FIXED_AMT) {
      if (
        Number(userCoupon.coupon.discountValue).toFixed(2) !==
        couponDiscountAmt.toFixed(2)
      ) {
        throw new ApiException(
          ResponseCode.STATUS_7008_INVALID_COUPON_DISCOUNT_AMT,
        );
      }
    }
    //todo: percentage coupon not yet supported
    if (userCoupon.coupon.type === CouponType.PERCENTAGE) {
      throw new ApiException(ResponseCode.STATUS_7002_INVALID_USER_COUPON);
    }

    // if (userCoupon.coupon.type === CouponType.PERCENTAGE) {
    //   if (
    //     totalChargeAmt -
    //       (totalChargeAmt * userCoupon.coupon.discountValue) / 100 !==
    //     finalChargeAmt
    //   ) {
    //     throw new ApiException(
    //       ResponseCode.STATUS_7003_INVALID_TOTAL_CHARGE_AMT,
    //     );
    //   }
    // }
    return true;
  }

  async savePaymentIntent(entity: PaymentIntent) {
    return await this.paymentIntentRepository.savePaymentIntent(entity);
  }

  async findOnePaymentIntentByStripePaymentIntentId(
    stripePaymentIntentId: string,
  ) {
    return await this.paymentIntentRepository.findOnePaymentIntentByStripePaymentIntentIdAndIsDeletedFalse(
      stripePaymentIntentId,
    );
  }

  async saveStripeWebhook(entity: StripeWebhook) {
    return await this.stripeWebhookRepository.saveStripeWebhook(entity);
  }
}

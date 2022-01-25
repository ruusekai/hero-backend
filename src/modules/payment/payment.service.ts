import { Injectable, Logger } from '@nestjs/common';
import { UserCoupon } from '../../database/mysql/entities/user.coupon.entity';
import { UserService } from '../user/user.service';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { CouponType } from './enum/coupon.type';
import { CreateTaskPaymentReqDto } from './dto/create.task.payment.req.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly userService: UserService) {}

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
    totalChargeAmt: number,
    finalChargeAmt: number,
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
      if (totalChargeAmt - userCoupon.coupon.discountValue !== finalChargeAmt) {
        throw new ApiException(
          ResponseCode.STATUS_7003_INVALID_TOTAL_CHARGE_AMT,
        );
      }
    }
    if (userCoupon.coupon.type === CouponType.PERCENTAGE) {
      if (
        totalChargeAmt -
          (totalChargeAmt * userCoupon.coupon.discountValue) / 100 !==
        finalChargeAmt
      ) {
        throw new ApiException(
          ResponseCode.STATUS_7003_INVALID_TOTAL_CHARGE_AMT,
        );
      }
    }
    return true;
  }
}

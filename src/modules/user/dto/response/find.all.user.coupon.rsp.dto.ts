import { UserCouponDto } from '../entity/user.coupon.dto';

export class FindAllUserCouponRspDto {
  constructor(userCoupons: UserCouponDto[]) {
    this.userCoupons = userCoupons;
  }
  userCoupons: UserCouponDto[];
}

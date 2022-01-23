import { UserCouponStatus } from '../../enum/user.coupon.status';
import { CouponType } from '../../../payment/enum/coupon.type';

export class UserCouponDto {
  constructor(
    userCouponUuid: string,
    couponType: CouponType,
    couponCode: string,
    status: UserCouponStatus,
    expiryDate: Date,
    couponName: string,
    couponDescription: string,
    discountValue: number,
  ) {
    this.userCouponUuid = userCouponUuid;
    this.couponType = couponType;
    this.couponCode = couponCode;
    this.status = status;
    this.expiryDate = expiryDate;
    this.couponName = couponName;
    this.couponDescription = couponDescription;
    this.discountValue = discountValue;
  }
  userCouponUuid: string;
  couponType: CouponType;
  couponCode: string;
  status: UserCouponStatus;
  expiryDate: Date;
  couponName: string;
  couponDescription: string;
  discountValue: number;
}

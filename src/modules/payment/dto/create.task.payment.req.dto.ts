import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskPaymentReqDto {
  @IsOptional()
  userCouponUuid: string;
  @IsOptional()
  couponDiscountAmt: number;
  @IsNotEmpty()
  finalChargeAmt: number;
}

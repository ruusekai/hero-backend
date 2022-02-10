import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskPaymentReqDto {
  @IsOptional()
  userCouponUuid: string;
  @IsNotEmpty()
  finalChargeAmt: number;
}

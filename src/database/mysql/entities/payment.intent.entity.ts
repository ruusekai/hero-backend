import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class PaymentIntent extends BaseEntity {
  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'stripe_customer_id' })
  stripeCustomerId: string;

  @Column({ name: 'stripe_payment_intent_id' })
  stripePaymentIntentId: string;

  @Column({ name: 'ref_id' })
  refId: string;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'user_coupon_uuid' })
  userCouponUuid: string;

  @Column({ name: 'coupon_discount_amt' })
  couponDiscountAmt: number;

  @Column({ name: 'total_charge_amt' })
  totalChargeAmt: number;

  @Column({ name: 'final_charge_amt' })
  finalChargeAmt: number;

  @Column({ name: 'currency' })
  currency: string;
}

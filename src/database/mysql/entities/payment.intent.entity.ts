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

  @Column({ name: 'task_uuid' })
  taskUuid: string;

  @Column({ name: 'user_coupon_uuid' })
  userCouponUuid: string;

  @Column({ name: 'coupon_discount_amt' })
  couponDiscountAmt: number;

  @Column({ name: 'effective_coupon_discount_amt' })
  effectiveCouponDiscountAmt: number;

  @Column({ name: 'total_charge_amt' })
  totalChargeAmt: number;

  @Column({ name: 'final_charge_amt' })
  finalChargeAmt: number;

  @Column({ name: 'currency' })
  currency: string;

  @Column({ name: 'stripe_payment_method_types' })
  stripePaymentMethodTypes: string;

  @Column({ name: 'stripe_amount_capturable' })
  stripeAmountCapturable: string;

  @Column({ name: 'stripe_amount_received' })
  stripeAmountReceived: string;

  @Column({ name: 'stripe_canceled_at' })
  stripeCanceledAt: Date;

  @Column({ name: 'stripe_cancellation_reason' })
  stripeCancellationReason: string;

  @Column({ name: 'stripe_status' })
  stripeStatus: string;
}

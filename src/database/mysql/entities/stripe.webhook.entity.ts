import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class StripeWebhook extends BaseEntity {
  @Column({ name: 'stripe_payment_intent_id' })
  stripePaymentIntentId: string;

  @Column({ name: 'webhook' })
  webhook: string;
}

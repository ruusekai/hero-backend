import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CouponType } from '../../../modules/payment/enum/coupon.type';

@Entity()
export class Coupon extends BaseEntity {
  @Column({ name: 'code', unique: true })
  code: string;

  @Column({ name: 'type' })
  type: CouponType;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'discount_value' })
  discountValue: number;

  @Column({ name: 'currency' })
  currency: string;
}

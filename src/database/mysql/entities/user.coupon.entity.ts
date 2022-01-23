import { Column, Entity, Generated, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Coupon } from './coupon.entity';
import { UserCouponStatus } from '../../../modules/user/enum/user.coupon.status';

@Entity()
export class UserCoupon extends BaseEntity {
  @Column({ name: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'coupon_code' })
  couponCode: string;

  @Column({ name: 'status' })
  status: UserCouponStatus;

  @Column({ name: 'expiry_date' })
  expiryDate: Date;

  @ManyToOne(() => Coupon)
  @JoinColumn({ name: 'coupon_code', referencedColumnName: 'code' })
  coupon: Coupon;
}

import { Column, Entity, Generated, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { AdminApprovalStatus } from '../../../common/enum/admin.approval.status';
import { AdminDeclineReason } from '../../../common/enum/admin.decline.reason';
import { TaskCategory } from '../../../modules/task/enum/task.category';
import { TaskPaymentStatus } from '../../../modules/task/enum/task.payment.status';
import { TaskPostStatus } from '../../../modules/task/enum/task-post-status';

@Entity()
export class Task extends BaseEntity {
  constructor(
    bossUserUuid: string,
    banner: string,
    title: string,
    description: string,
    regionId: string,
    districtId: string,
    address: string,
    latitude: string,
    longitude: string,
    expiryDate: Date,
    basicCostAmt: number,
    heroRewardAmt: number,
    serviceChargeAmt: number,
    totalChargeAmt: number,
    currency: string,
    adminStatus: AdminApprovalStatus,
    paymentStatus: TaskPaymentStatus,
  ) {
    super();
    this.bossUserUuid = bossUserUuid;
    this.banner = banner;
    this.title = title;
    this.description = description;
    this.regionId = regionId;
    this.districtId = districtId;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.expiryDate = expiryDate;
    this.basicCostAmt = basicCostAmt;
    this.heroRewardAmt = heroRewardAmt;
    this.serviceChargeAmt = serviceChargeAmt;
    this.totalChargeAmt = totalChargeAmt;
    this.currency = currency;
    this.adminStatus = adminStatus;
    this.paymentStatus = paymentStatus;
  }

  @Column({ name: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'category' })
  category: TaskCategory;

  @Column({ name: 'boss_user_uuid' })
  bossUserUuid: string;

  @Column({ name: 'banner' })
  banner: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'region_id' })
  regionId: string;

  @Column({ name: 'district_id' })
  districtId: string;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'latitude' })
  latitude: string;

  @Column({ name: 'longitude' })
  longitude: string;

  @Column({ name: 'expiry_date' })
  expiryDate: Date;

  @Column({ name: 'basic_cost_amt' })
  basicCostAmt: number;

  @Column({ name: 'hero_reward_amt' })
  heroRewardAmt: number;

  @Column({ name: 'service_charge_amt' })
  serviceChargeAmt: number;

  @Column({ name: 'total_charge_amt' })
  totalChargeAmt: number;

  @Column({ name: 'currency' })
  currency: string;

  @Column({ name: 'admin_status' })
  adminStatus: AdminApprovalStatus;

  @Column({ name: 'decline_reason' })
  declineReason: AdminDeclineReason;

  @Column({ name: 'admin_remarks' })
  adminRemarks: string;

  @Column({ name: 'payment_status' })
  paymentStatus: TaskPaymentStatus;

  @Column({ name: 'payment_intent_id' })
  paymentIntentId: string;

  @Column({ name: 'post_status' })
  postStatus: TaskPostStatus;

  @Column({ name: 'message_group_id' })
  messageGroupId: string;

  @Column({ name: 'hero_user_uuid' })
  heroUserUuid: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'boss_user_uuid', referencedColumnName: 'uuid' })
  bossUser: User;
}

import { Column, Entity, Generated, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { AdminApprovalStatus } from '../../../common/enum/admin.approval.status';
import { AdminDeclineReason } from '../../../common/enum/admin.decline.reason';
import { TaskCategory } from '../../../modules/task/enum/task.category';

@Entity()
export class Task extends BaseEntity {
  constructor(
    category: TaskCategory,
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
    totalChargeAmt: number,
    currency: string,
    adminStatus: AdminApprovalStatus,
  ) {
    super();
    this.category = category;
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
    this.totalChargeAmt = totalChargeAmt;
    this.currency = currency;
    this.adminStatus = adminStatus;
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'boss_user_uuid', referencedColumnName: 'uuid' })
  bossUser: User;
}

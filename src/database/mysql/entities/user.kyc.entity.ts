import { Column, Entity, Generated, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { AdminApprovalStatus } from '../../../common/enum/admin.approval.status';
import { AdminDeclineReason } from '../../../common/enum/admin.decline.reason';

@Entity()
export class UserKyc extends BaseEntity {
  constructor(
    userUuid: string,
    kycIdFileUuid: string,
    selfieFileUuid: string,
    fullName: string,
    kycIdNumber: string,
    adminStatus: AdminApprovalStatus,
  ) {
    super();
    this.userUuid = userUuid;
    this.kycIdFileUuid = kycIdFileUuid;
    this.selfieFileUuid = selfieFileUuid;
    this.fullName = fullName;
    this.kycIdNumber = kycIdNumber;
    this.adminStatus = adminStatus;
  }
  @Column({ name: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'kyc_id_file_uuid' })
  kycIdFileUuid: string;

  @Column({ name: 'selfie_file_uuid' })
  selfieFileUuid: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'kyc_id_number' })
  kycIdNumber: string;

  @Column({ name: 'admin_status' })
  adminStatus: AdminApprovalStatus;

  @Column({ name: 'decline_reason' })
  declineReason: AdminDeclineReason;

  @Column({ name: 'admin_remarks' })
  adminRemarks: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_uuid', referencedColumnName: 'uuid' })
  user: User;
}

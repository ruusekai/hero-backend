import { Column, Entity, Generated, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { AdminApprovalStatus } from '../../../common/enum/admin.approval.status';
import { AdminDeclineReason } from '../../../common/enum/admin.decline.reason';

@Entity()
export class UserBank extends BaseEntity {
  constructor(
    userUuid: string,
    bankingCardFileUuid: string,
    fullName: string,
    bankCode: string,
    bankNumber: string,
    adminStatus: AdminApprovalStatus,
  ) {
    super();
    this.userUuid = userUuid;
    this.bankingCardFileUuid = bankingCardFileUuid;
    this.fullName = fullName;
    this.bankCode = bankCode;
    this.bankNumber = bankNumber;
    this.adminStatus = adminStatus;
  }

  @Column({ name: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'banking_card_file_uuid' })
  bankingCardFileUuid: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'bank_code' })
  bankCode: string;

  @Column({ name: 'bank_number' })
  bankNumber: string;

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

import { Entity, Column, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { AdminApprovalStatus } from '../../../common/enum/admin.approval.status';
import { AdminDeclineReason } from '../../../common/enum/admin.decline.reason';

@Entity()
export class UserKyc extends BaseEntity {
  @Column({ name: 'user_uuid', unique: true })
  userUuid: string;

  @Column({ name: 'image_path' })
  imagePath: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'id_number' })
  idNumber: string;

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

import { Column, Entity, Generated } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WithdrawalStatus } from '../../../modules/wallet/enum/withdrawal.status';
import { ColumnNumericTransformer } from '../../../common/transformer/column.numeric.transformer';

@Entity()
export class HeroWalletWithdrawalRequest extends BaseEntity {
  constructor(
    userUuid: string,
    withdrawalAmt: number,
    withdrawalStatus: WithdrawalStatus,
  ) {
    super();
    this.userUuid = userUuid;
    this.withdrawalAmt = withdrawalAmt;
    this.withdrawalStatus = withdrawalStatus;
  }

  @Column({ name: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    name: 'withdrawal_amt',
  })
  withdrawalAmt: number;

  @Column({ name: 'withdrawal_status' })
  withdrawalStatus: WithdrawalStatus;

  @Column({ name: 'decline_reason' })
  declineReason: string;

  @Column({ name: 'admin_remarks' })
  adminRemarks: string;
}

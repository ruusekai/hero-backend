import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WalletHistoryType } from '../../../modules/wallet/enum/wallet.history.type';

@Entity()
export class HeroWalletHistory extends BaseEntity {
  constructor(
    refId: string,
    userUuid: string,
    type: WalletHistoryType,
    amount: number,
  ) {
    super();
    this.refId = refId;
    this.userUuid = userUuid;
    this.type = type;
    this.amount = amount;
  }

  @Column({ name: 'ref_id' })
  refId: string;

  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'type' })
  type: WalletHistoryType;

  @Column({ name: 'amount' })
  amount: number;
}

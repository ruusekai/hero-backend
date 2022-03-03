import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WalletHistoryType } from '../../../modules/wallet/enum/wallet.history.type';
import { ColumnNumericTransformer } from '../../../common/transformer/column.numeric.transformer';

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

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    name: 'amount',
  })
  amount: number;
}

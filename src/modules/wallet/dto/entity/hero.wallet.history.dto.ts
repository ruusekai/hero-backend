import { WalletHistoryType } from '../../enum/wallet.history.type';

export class HeroWalletHistoryDto {
  constructor(
    refId: string,
    userUuid: string,
    type: WalletHistoryType,
    amount: number,
  ) {
    this.refId = refId;
    this.userUuid = userUuid;
    this.type = type;
    this.amount = amount;
  }
  refId: string;
  userUuid: string;
  type: WalletHistoryType;
  amount: number;
}

import { WithdrawalStatus } from '../../enum/withdrawal.status';
import { HeroWalletWithdrawalRequest } from '../../../../database/mysql/entities/hero.wallet.withdrawal.request.entity';

export class CreateHeroWalletWithdrawalRequestRspDto {
  constructor(withdrawalReq: HeroWalletWithdrawalRequest) {
    this.uuid = withdrawalReq.uuid;
    this.userUuid = withdrawalReq.userUuid;
    this.withdrawalAmt = withdrawalReq.withdrawalAmt;
    this.withdrawalStatus = withdrawalReq.withdrawalStatus;
    this.createdDate = withdrawalReq.createdDate;
  }
  uuid: string;
  userUuid: string;
  withdrawalAmt: number;
  withdrawalStatus: WithdrawalStatus;
  createdDate: Date;
}

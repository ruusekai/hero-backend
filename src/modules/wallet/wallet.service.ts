import { Injectable } from '@nestjs/common';
import { TaskMatchingAttempt } from '../../database/mysql/entities/task.matching.attempt.entity';
import { HeroWalletHistoryRepository } from '../../database/mysql/repositories/hero.wallet.history.repository';
import { HeroWalletDepositRepository } from '../../database/mysql/repositories/hero.wallet.deposit.repository';
import { WalletHistoryType } from './enum/wallet.history.type';
import { HeroWalletHistory } from '../../database/mysql/entities/hero.wallet.history.entity';
import { HeroWalletDeposit } from '../../database/mysql/entities/hero.wallet.deposit.entity';
import { HeroWalletWithdrawalRequestRepository } from '../../database/mysql/repositories/hero.wallet.withdrawal.request.repository';
import { HeroWalletWithdrawalRequest } from '../../database/mysql/entities/hero.wallet.withdrawal.request.entity';
import { WithdrawalStatus } from './enum/withdrawal.status';
import { GetHeroWalletBalanceRspDto } from './dto/response/get.hero.wallet.balance.rsp.dto';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletHistoryRepo: HeroWalletHistoryRepository,
    private readonly depositRepo: HeroWalletDepositRepository,
    private readonly withdrawalReqRepo: HeroWalletWithdrawalRequestRepository,
  ) {}

  async sumHeroWalletBalance(
    userUuid: string,
  ): Promise<GetHeroWalletBalanceRspDto> {
    const depositSum = await this.walletHistoryRepo.sumDepositAmountByUserUuid(
      userUuid,
    );
    const withdrawalSuccessSum =
      await this.withdrawalReqRepo.sumWithdrawalAmountByUserUuidAndStatus(
        userUuid,
        WithdrawalStatus.SUCCESS,
      );
    const withdrawalPendingSum: number =
      await this.withdrawalReqRepo.sumWithdrawalAmountByUserUuidAndStatus(
        userUuid,
        WithdrawalStatus.PENDING,
      );

    return new GetHeroWalletBalanceRspDto(
      depositSum - withdrawalSuccessSum - withdrawalPendingSum,
      withdrawalPendingSum,
    );
  }

  async addHeroRewardAmtToHeroWalletByMatchingAttempt(
    matchingAttempt: TaskMatchingAttempt,
  ): Promise<HeroWalletHistory> {
    let deposit: HeroWalletDeposit = new HeroWalletDeposit(
      matchingAttempt.heroUserUuid,
      matchingAttempt.taskUuid,
      matchingAttempt.messageGroupId,
      matchingAttempt.task.heroRewardAmt,
    );
    deposit = await this.depositRepo.saveHeroWalletHistory(deposit);

    const history: HeroWalletHistory = new HeroWalletHistory(
      deposit.uuid,
      deposit.userUuid,
      WalletHistoryType.DEPOSIT,
      deposit.heroRewardAmt,
    );
    return await this.walletHistoryRepo.saveHeroWalletHistory(history);
  }

  async createHeroWalletWithdrawalRequest(
    userUuid: string,
    requestAmt: number,
  ) {
    let withdrawalReq: HeroWalletWithdrawalRequest =
      new HeroWalletWithdrawalRequest(
        userUuid,
        requestAmt,
        WithdrawalStatus.PENDING,
      );
    withdrawalReq =
      await this.withdrawalReqRepo.saveHeroWalletWithdrawalRequest(
        withdrawalReq,
      );
    return withdrawalReq;
  }
}

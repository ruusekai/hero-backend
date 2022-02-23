import { Injectable } from '@nestjs/common';
import { TaskMatchingAttempt } from '../../database/mysql/entities/task.matching.attempt.entity';
import { HeroWalletHistoryRepository } from '../../database/mysql/repositories/hero.wallet.history.repository';
import { HeroWalletDepositRepository } from '../../database/mysql/repositories/hero.wallet.deposit.repository';
import { WalletHistoryType } from './enum/wallet.history.type';
import { HeroWalletHistory } from '../../database/mysql/entities/hero.wallet.history.entity';
import { HeroWalletDeposit } from '../../database/mysql/entities/hero.wallet.deposit.entity';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletHistoryRepo: HeroWalletHistoryRepository,
    private readonly depositRepo: HeroWalletDepositRepository,
  ) {}

  async sumHeroWalletBalance(userUuid: string): Promise<number> {
    const result = await this.walletHistoryRepo.sumAmountByUserUuid(userUuid);
    return result.average_amount;
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
}

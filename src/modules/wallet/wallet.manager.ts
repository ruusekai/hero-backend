import { Injectable } from '@nestjs/common';
import { HeroWalletHistoryRepository } from '../../database/mysql/repositories/hero.wallet.history.repository';
import { HeroWalletDepositRepository } from '../../database/mysql/repositories/hero.wallet.deposit.repository';
import { GetHeroWalletBalanceRspDto } from './dto/response/get.hero.wallet.balance.rsp.dto';
import { AppResponse } from '../../common/response/app.response';
import { HeroWalletHistoryDto } from './dto/entity/hero.wallet.history.dto';
import { ListHeroWalletHistoryRspDto } from './dto/response/list.hero.wallet.history.rsp.dto';

@Injectable()
export class WalletManager {
  constructor(
    private readonly walletHistoryRepo: HeroWalletHistoryRepository,
    private readonly depositRepo: HeroWalletDepositRepository,
  ) {}

  async getHeroWalletBalance(userUuid: string): Promise<AppResponse> {
    const result = await this.walletHistoryRepo.sumAmountByUserUuid(userUuid);
    const rsp = new GetHeroWalletBalanceRspDto(result.average_amount);
    return new AppResponse(rsp);
  }

  async listHeroWalletHistory(userUuid: string): Promise<AppResponse> {
    const entityList =
      await this.walletHistoryRepo.findHeroWalletHistoryListByUserUuidOrderByCreatedDateDesc(
        userUuid,
      );
    const history: HeroWalletHistoryDto[] = entityList.map((entity) => {
      return new HeroWalletHistoryDto(
        entity.refId,
        entity.userUuid,
        entity.type,
        entity.amount,
      );
    });
    const rsp = new ListHeroWalletHistoryRspDto(history);
    return new AppResponse(rsp);
  }
}

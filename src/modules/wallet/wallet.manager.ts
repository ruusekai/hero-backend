import { Injectable, Logger } from '@nestjs/common';
import { HeroWalletHistoryRepository } from '../../database/mysql/repositories/hero.wallet.history.repository';
import { HeroWalletDepositRepository } from '../../database/mysql/repositories/hero.wallet.deposit.repository';
import { GetHeroWalletBalanceRspDto } from './dto/response/get.hero.wallet.balance.rsp.dto';
import { AppResponse } from '../../common/response/app.response';
import { HeroWalletHistoryDto } from './dto/entity/hero.wallet.history.dto';
import { ListHeroWalletHistoryRspDto } from './dto/response/list.hero.wallet.history.rsp.dto';
import { WalletService } from './wallet.service';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { HeroWalletWithdrawalRequest } from '../../database/mysql/entities/hero.wallet.withdrawal.request.entity';
import { WithdrawalStatus } from './enum/withdrawal.status';
import { HeroWalletWithdrawalRequestRepository } from '../../database/mysql/repositories/hero.wallet.withdrawal.request.repository';
import { CreateHeroWalletWithdrawalRequestRspDto } from './dto/response/create.hero.wallet.withdrawal.request.rsp.dto';

@Injectable()
export class WalletManager {
  constructor(
    private readonly walletHistoryRepo: HeroWalletHistoryRepository,
    private readonly depositRepo: HeroWalletDepositRepository,
    private readonly withdrawalReqRepo: HeroWalletWithdrawalRequestRepository,
    private readonly walletService: WalletService,
  ) {}

  private readonly logger = new Logger(WalletManager.name);

  async getHeroWalletBalance(userUuid: string): Promise<AppResponse> {
    const result = await this.walletService.sumHeroWalletBalance(userUuid);
    return new AppResponse(result);
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

  async createHeroWalletWithdrawalRequest(
    requestAmt: number,
    userUuid: string,
  ) {
    const walletBalanceDetail: GetHeroWalletBalanceRspDto =
      await this.walletService.sumHeroWalletBalance(userUuid);
    const currentBalance = walletBalanceDetail.balance;
    if (requestAmt == null || requestAmt === 0 || requestAmt > currentBalance) {
      this.logger.error(`invalid withdrawal request amt: ${requestAmt}`);
      throw new ApiException(ResponseCode.STATUS_7201_INVALID_WITHDRAWAL_AMT);
    }

    const withdrawalReq: HeroWalletWithdrawalRequest =
      await this.walletService.createHeroWalletWithdrawalRequest(
        userUuid,
        requestAmt,
      );

    const rsp = new CreateHeroWalletWithdrawalRequestRspDto(withdrawalReq);
    return new AppResponse(rsp);
  }
}

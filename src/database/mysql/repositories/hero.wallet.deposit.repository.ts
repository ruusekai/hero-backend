import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { HeroWalletDeposit } from '../entities/hero.wallet.deposit.entity';

@EntityRepository(HeroWalletDeposit)
@Injectable()
export class HeroWalletDepositRepository extends Repository<HeroWalletDeposit> {
  constructor() {
    super();
  }

  async saveHeroWalletHistory(
    HeroWalletHistory: HeroWalletDeposit,
  ): Promise<HeroWalletDeposit> {
    try {
      HeroWalletHistory.updatedDate = new Date(Date.now());
      return await this.save(HeroWalletHistory);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

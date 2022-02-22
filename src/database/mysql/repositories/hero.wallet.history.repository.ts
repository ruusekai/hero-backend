import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { HeroWalletHistory } from '../entities/hero.wallet.History.entity';
import { AdminApprovalStatus } from '../../../common/enum/admin.approval.status';
import { raw } from 'express';

@EntityRepository(HeroWalletHistory)
@Injectable()
export class HeroWalletHistoryRepository extends Repository<HeroWalletHistory> {
  constructor() {
    super();
  }

  async saveHeroWalletHistory(
    HeroWalletHistory: HeroWalletHistory,
  ): Promise<HeroWalletHistory> {
    try {
      HeroWalletHistory.updatedDate = new Date(Date.now());
      return await this.save(HeroWalletHistory);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async averageAmountByUserUuid(userUuid: string): Promise<any> {
    const queryBuilder = this.createQueryBuilder('hero_wallet_history')
      .where('hero_wallet_history.user_uuid = :userUuid', {
        userUuid: userUuid,
      })
      .select(`AVG(hero_wallet_history.amount)`, 'average_amount');
    return await queryBuilder.getRawOne();
  }
}

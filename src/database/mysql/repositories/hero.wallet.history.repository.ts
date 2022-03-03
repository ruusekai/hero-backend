import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { HeroWalletHistory } from '../entities/hero.wallet.history.entity';
import { WalletHistoryType } from '../../../modules/wallet/enum/wallet.history.type';

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

  async sumDepositAmountByUserUuid(userUuid: string): Promise<number> {
    const queryBuilder = this.createQueryBuilder('hero_wallet_history')
      .where('hero_wallet_history.user_uuid = :userUuid', {
        userUuid: userUuid,
      })
      .andWhere('hero_wallet_history.type = :type', {
        type: WalletHistoryType.DEPOSIT,
      })
      .select(`SUM(hero_wallet_history.amount)`, 'sum_amount');
    const result = await queryBuilder.getRawOne();
    return result.sum_amount == null ? 0 : +result.sum_amount;
  }

  async findHeroWalletHistoryListByUserUuidOrderByCreatedDateDesc(
    userUuid: string,
  ): Promise<HeroWalletHistory[]> {
    try {
      return await this.find({
        where: { userUuid: userUuid, isDeleted: false },
        order: {
          createdDate: 'DESC',
        },
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

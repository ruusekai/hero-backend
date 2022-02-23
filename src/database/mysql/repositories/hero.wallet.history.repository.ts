import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { HeroWalletHistory } from '../entities/hero.wallet.History.entity';
import { PushAudience } from '../entities/push.audience.entity';

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

  async sumAmountByUserUuid(userUuid: string): Promise<any> {
    const queryBuilder = this.createQueryBuilder('hero_wallet_history')
      .where('hero_wallet_history.user_uuid = :userUuid', {
        userUuid: userUuid,
      })
      .select(`SUM(hero_wallet_history.amount)`, 'average_amount');
    return await queryBuilder.getRawOne();
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

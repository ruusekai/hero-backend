import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { HeroWalletWithdrawalRequest } from '../entities/hero.wallet.withdrawal.request.entity';
import { WithdrawalStatus } from '../../../modules/wallet/enum/withdrawal.status';

@EntityRepository(HeroWalletWithdrawalRequest)
@Injectable()
export class HeroWalletWithdrawalRequestRepository extends Repository<HeroWalletWithdrawalRequest> {
  constructor() {
    super();
  }

  async saveHeroWalletWithdrawalRequest(
    HeroWalletWithdrawalRequest: HeroWalletWithdrawalRequest,
  ): Promise<HeroWalletWithdrawalRequest> {
    try {
      HeroWalletWithdrawalRequest.updatedDate = new Date(Date.now());
      return await this.save(HeroWalletWithdrawalRequest);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async sumWithdrawalAmountByUserUuidAndStatus(
    userUuid: string,
    status: WithdrawalStatus,
  ): Promise<number> {
    const queryBuilder = this.createQueryBuilder(
      'hero_wallet_withdrawal_request',
    )
      .where('hero_wallet_withdrawal_request.user_uuid = :userUuid', {
        userUuid: userUuid,
      })
      .andWhere('hero_wallet_withdrawal_request.withdrawal_status = :status', {
        status: status,
      })
      .select(
        `SUM(hero_wallet_withdrawal_request.withdrawal_amt)`,
        'sum_amount',
      );
    const result = await queryBuilder.getRawOne();
    return result.sum_amount == null ? 0 : +result.sum_amount;
  }

  async findHeroWalletWithdrawalRequestListByUserUuidOrderByCreatedDateDesc(
    userUuid: string,
  ): Promise<HeroWalletWithdrawalRequest[]> {
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

import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { Review } from '../entities/review.entity';
import { AdminApprovalStatus } from '../../../common/enum/admin.approval.status';

@EntityRepository(Review)
@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor() {
    super();
  }

  async avgReviewScoreByTargetUserUuid(userUuid: string): Promise<number> {
    const queryBuilder = this.createQueryBuilder('review')
      .where('review.target_user_uuid = :userUuid', {
        userUuid: userUuid,
      })
      .andWhere('review.admin_status = :adminStatus', {
        adminStatus: AdminApprovalStatus.APPROVED,
      })
      .andWhere('review.is_deleted = :isDeleted', {
        isDeleted: false,
      })
      .select(`AVG(review.score)`, 'average_score');

    const result = await queryBuilder.getRawOne();
    console.log(result.average_score);
    return result.average_score == null ? 0 : +result.average_score;
  }

  async findReviewByTargetUserUuid(userUuid: string): Promise<Review[]> {
    try {
      return await this.find({
        where: {
          targetUserUuid: userUuid,
          adminStatus: AdminApprovalStatus.APPROVED,
          isDeleted: false,
        },
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findOneReviewByUuid(uuid: string): Promise<Review> {
    try {
      return await this.findOne({
        where: { uuid: uuid, isDeleted: false },
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveReview(review: Review): Promise<Review> {
    try {
      review.updatedDate = new Date(Date.now());
      return await this.save(review);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

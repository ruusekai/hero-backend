import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../../database/mysql/repositories/review.repository';
import { Review } from '../../database/mysql/entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepo: ReviewRepository) {}

  async saveReview(entity: Review): Promise<Review> {
    return await this.reviewRepo.saveReview(entity);
  }

  async avgReviewScoreByTargetUserUuid(
    targetUserUuid: string,
  ): Promise<number> {
    return await this.reviewRepo.avgReviewScoreByTargetUserUuid(targetUserUuid);
  }

  async findReviewByTargetUserUuid(targetUserUuid: string): Promise<Review[]> {
    return await this.reviewRepo.findReviewByTargetUserUuid(targetUserUuid);
  }

  async findOneReviewByUuid(reviewUuid: string): Promise<Review> {
    return await this.reviewRepo.findOneReviewByUuid(reviewUuid);
  }
}

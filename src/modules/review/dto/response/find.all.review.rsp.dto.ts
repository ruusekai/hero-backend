import { CreateReviewRspDto } from './create.review.rsp.dto';

export class FindAllReviewRspDto {
  constructor(reviewHistory: CreateReviewRspDto[]) {
    this.reviewHistory = reviewHistory;
  }

  reviewHistory: CreateReviewRspDto[];
}

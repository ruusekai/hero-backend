import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ReviewManager } from './review.manager';
import { CreateReviewReqDto } from './dto/request/create.review.req.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewManager: ReviewManager) {}

  @Post('/task-matching-attempt/:messageGroupId')
  createTaskMatchingAttemptReview(
    @Request() req,
    @Param('messageGroupId') messageGroupId: string,
    @Body() createReviewReqDto: CreateReviewReqDto,
  ) {
    return this.reviewManager.createTaskMatchingAttemptReview(
      req.user.uuid,
      messageGroupId,
      createReviewReqDto.score,
      createReviewReqDto.description,
    );
  }

  @Get('score')
  findReviewAverageScore(@Request() req) {
    return this.reviewManager.findReviewAverageScore(req.user.uuid);
  }

  @Get('history')
  findAllReview(@Request() req) {
    return this.reviewManager.findAllReviewWithTargetUserUuid(req.user.uuid);
  }
}

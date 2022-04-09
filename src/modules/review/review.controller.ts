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

  @Get('score/:userUuid')
  findReviewAverageScore(@Request() req, @Param('userUuid') userUuid: string) {
    return this.reviewManager.findReviewAverageScore(userUuid);
  }

  @Get('history/:userUuid')
  findAllReview(@Request() req, @Param('userUuid') userUuid: string) {
    return this.reviewManager.findAllReviewWithTargetUserUuid(userUuid);
  }
}

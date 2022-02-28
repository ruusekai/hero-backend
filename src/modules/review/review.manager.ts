import { Injectable, Logger } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AppResponse } from '../../common/response/app.response';
import { TaskMatchingAttemptService } from '../../task-matching-attempt/task-matching-attempt.service';
import { TaskMatchingAttempt } from '../../database/mysql/entities/task.matching.attempt.entity';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { TaskMatchingAttemptStatus } from '../task/enum/matching-attempt-status';
import { MessageUserRoleType } from '../message/enum/message-user-role-type';
import { Review } from '../../database/mysql/entities/review.entity';
import { CreateReviewRspDto } from './dto/response/create.review.rsp.dto';
import { FindReviewAverageScoreRspDto } from './dto/response/find.review.average.score.rsp.dto';
import { FindAllReviewRspDto } from './dto/response/find.all.review.rsp.dto';

@Injectable()
export class ReviewManager {
  private readonly logger = new Logger(ReviewManager.name);

  constructor(
    private readonly reviewService: ReviewService,
    private readonly matchingAttemptService: TaskMatchingAttemptService,
  ) {}
  async createTaskMatchingAttemptReview(
    userUuid: string,
    messageGroupId: string,
    score: number,
    description: string,
  ): Promise<AppResponse> {
    const matchingAttempt: TaskMatchingAttempt =
      await this.matchingAttemptService.findOneMatchingAttemptWithUserUuidChecking(
        messageGroupId,
        userUuid,
      );

    //1.checking
    if (
      //only done/cancel task can do
      matchingAttempt.status !== TaskMatchingAttemptStatus.BOSS_ACCEPT_DONE &&
      matchingAttempt.status !== TaskMatchingAttemptStatus.HERO_CANCEL_MATCHING
    ) {
      this.logger.error(
        `[review] invalid attempt status: ${matchingAttempt.status}`,
      );
      throw new ApiException(
        ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
      );
    }
    this.logger.log(
      `[review] matchingAttemptId: ${matchingAttempt.messageGroupId}`,
    );
    let fromUserUuid: string = null;
    let fromUserRole: MessageUserRoleType = null;
    let fromUserName: string = null;
    let targetUserUuid: string = null;
    let targetUserRole: MessageUserRoleType = null;
    let targetUserName: string = null;

    //2. map user role
    //user is boss
    if (matchingAttempt.bossUserUuid === userUuid) {
      if (matchingAttempt.isBossReviewed !== false) {
        this.logger.error(
          `[review] boss ${userUuid} already reviewed for matching ${messageGroupId}`,
        );
        throw new ApiException(ResponseCode.STATUS_7100_ALREADY_REVIEWED);
      }
      fromUserUuid = userUuid;
      fromUserRole = MessageUserRoleType.BOSS;
      fromUserName = matchingAttempt.bossName;
      targetUserUuid = matchingAttempt.heroUserUuid;
      targetUserRole = MessageUserRoleType.HERO;
      targetUserName = matchingAttempt.heroName;
    }
    //user is hero
    else if (matchingAttempt.heroUserUuid === userUuid) {
      if (matchingAttempt.isHeroReviewed !== false) {
        this.logger.error(
          `[review] hero ${userUuid} already reviewed for matching ${messageGroupId}`,
        );
        throw new ApiException(ResponseCode.STATUS_7100_ALREADY_REVIEWED);
      }
      fromUserUuid = userUuid;
      fromUserRole = MessageUserRoleType.HERO;
      fromUserName = matchingAttempt.heroName;
      targetUserUuid = matchingAttempt.bossUserUuid;
      targetUserRole = MessageUserRoleType.BOSS;
      targetUserName = matchingAttempt.bossName;
    } else {
      this.logger.error(`[review] userUuid not match, review forbidden`);
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    }

    //save review
    let review: Review = new Review(
      matchingAttempt.messageGroupId,
      fromUserUuid,
      fromUserRole,
      fromUserName,
      targetUserUuid,
      targetUserRole,
      targetUserName,
      score,
      description,
    );
    review = await this.reviewService.saveReview(review);

    //update matching attempt
    if (fromUserRole === MessageUserRoleType.HERO) {
      matchingAttempt.isHeroReviewed = true;
    } else if (fromUserRole === MessageUserRoleType.BOSS) {
      matchingAttempt.isBossReviewed = true;
    }
    await this.matchingAttemptService.saveTaskMatchingAttempt(matchingAttempt);

    const rsp = new CreateReviewRspDto(review);
    return new AppResponse(rsp);
  }

  async findReviewAverageScore(userUuid: string) {
    const avgScore: number =
      await this.reviewService.avgReviewScoreByTargetUserUuid(userUuid);
    const rsp = new FindReviewAverageScoreRspDto(
      avgScore == null ? 0 : avgScore,
    );
    return new AppResponse(rsp);
  }
  async findAllReviewWithTargetUserUuid(userUuid: string) {
    const reviewList: Review[] =
      await this.reviewService.findReviewByTargetUserUuid(userUuid);
    const reviewDtoList: CreateReviewRspDto[] = reviewList.map((entity) => {
      return new CreateReviewRspDto(entity);
    });
    const rsp = new FindAllReviewRspDto(reviewDtoList);
    return new AppResponse(rsp);
  }
}

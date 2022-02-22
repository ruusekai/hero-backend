import { TaskMatchingAttemptStatus } from '../../../modules/task/enum/matching-attempt-status';
import { TaskMatchingAttempt } from '../../../database/mysql/entities/task.matching.attempt.entity';

export class TaskMatchingAttemptRspDto {
  constructor(matchingAttempt: TaskMatchingAttempt) {
    this.messageGroupId = matchingAttempt.messageGroupId;
    this.taskUuid = matchingAttempt.taskUuid;
    this.heroName = matchingAttempt.heroName;
    this.bossName = matchingAttempt.bossName;
    this.isMatched = matchingAttempt.isMatched;
    this.status = matchingAttempt.status;
    this.isMessageGroupActive = matchingAttempt.isMessageGroupActive;
    this.isHeroReviewed = matchingAttempt.isHeroReviewed;
    this.isBossReviewed = matchingAttempt.isBossReviewed;
  }
  messageGroupId: string;

  taskUuid: string;

  heroName: string;

  bossName: string;

  isMatched: boolean;

  status: TaskMatchingAttemptStatus;

  isMessageGroupActive: boolean;

  isHeroReviewed: string;

  isBossReviewed: string;
}

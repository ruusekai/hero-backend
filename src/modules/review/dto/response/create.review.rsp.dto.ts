import { MessageUserRoleType } from '../../../message/enum/message-user-role-type';
import { Review } from '../../../../database/mysql/entities/review.entity';

export class CreateReviewRspDto {
  constructor(review: Review) {
    this.reviewUuid = review.uuid;
    this.messageGroupId = review.messageGroupId;
    this.fromUserUuid = review.fromUserUuid;
    this.fromUserRole = review.fromUserRole;
    this.fromUserName = review.fromUserName;
    this.targetUserUuid = review.targetUserUuid;
    this.targetUserRole = review.targetUserRole;
    this.targetUserName = review.targetUserName;
    this.score = review.score;
    this.description = review.description;
  }
  reviewUuid: string;
  messageGroupId: string;
  fromUserUuid: string;
  fromUserRole: MessageUserRoleType;
  fromUserName: string;
  targetUserUuid: string;
  targetUserRole: MessageUserRoleType;
  targetUserName: string;
  score: number;
  description: string;
}

import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MessageUserRoleType } from '../../../modules/message/enum/message-user-role-type';
import { MatchingHistoryActionType } from '../../../modules/task/enum/matching-history-action-type';

@Entity()
export class TaskHistory extends BaseEntity {
  constructor(
    taskUuid: string,
    messageGroupId: string,
    userUuid: string,
    userRole: MessageUserRoleType,
    actionType: MatchingHistoryActionType,
    oldStatus: string,
    newStatus: string,
  ) {
    super();
    this.taskUuid = taskUuid;
    this.messageGroupId = messageGroupId;
    this.userUuid = userUuid;
    this.userRole = userRole;
    this.actionType = actionType;
    this.oldStatus = oldStatus;
    this.newStatus = newStatus;
  }
  @Column({ name: 'task_uuid' })
  taskUuid: string;

  @Column({ name: 'message_group_id' })
  messageGroupId: string;

  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'user_role' })
  userRole: MessageUserRoleType;

  @Column({ name: 'action_type' })
  actionType: MatchingHistoryActionType;

  @Column({ name: 'old_status' })
  oldStatus: string;

  @Column({ name: 'new_status' })
  newStatus: string;
}

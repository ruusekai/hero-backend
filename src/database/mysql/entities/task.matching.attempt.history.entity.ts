import { Column, Entity, Generated, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MessageUserRoleType } from '../../../modules/message/enum/message-user-role-type';
import { MatchingHistoryActionType } from '../../../modules/task/enum/matching-history-action-type';

@Entity()
export class TaskMatchingAttemptHistory extends BaseEntity {
  //primary_key of the table
  @Column({ name: 'message_group_id' })
  messageGroupId: string;

  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'user_role' })
  userRole: MessageUserRoleType;

  @Column({ name: 'action_type' })
  actionType: MatchingHistoryActionType;

  @Column({ name: 'old_status' })
  old_status: string;

  @Column({ name: 'status' })
  new_status: string;
}

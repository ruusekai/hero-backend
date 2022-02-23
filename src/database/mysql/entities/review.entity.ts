import { Column, Entity, Generated } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MessageUserRoleType } from '../../../modules/message/enum/message-user-role-type';

@Entity()
export class Review extends BaseEntity {
  constructor(
    messageGroupId: string,
    fromUserUuid: string,
    fromUserRole: MessageUserRoleType,
    fromUserName: string,
    targetUserUuid: string,
    targetUserRole: MessageUserRoleType,
    targetUserName: string,
    score: number,
    description: string,
  ) {
    super();
    this.messageGroupId = messageGroupId;
    this.fromUserUuid = fromUserUuid;
    this.fromUserRole = fromUserRole;
    this.fromUserName = fromUserName;
    this.targetUserUuid = targetUserUuid;
    this.targetUserRole = targetUserRole;
    this.targetUserName = targetUserName;
    this.score = score;
    this.description = description;
  }
  @Column({ name: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'message_group_id' })
  messageGroupId: string;

  @Column({ name: 'from_user_uuid' })
  fromUserUuid: string;

  @Column({ name: 'from_user_role' })
  fromUserRole: MessageUserRoleType;

  @Column({ name: 'from_user_name' })
  fromUserName: string;

  @Column({ name: 'target_user_uuid' })
  targetUserUuid: string;

  @Column({ name: 'target_user_role' })
  targetUserRole: MessageUserRoleType;

  @Column({ name: 'target_user_name' })
  targetUserName: string;

  @Column({ name: 'score' })
  score: number;

  @Column({ name: 'description' })
  description: string;
}

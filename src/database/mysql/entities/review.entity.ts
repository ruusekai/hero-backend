import { Column, Entity, Generated } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MessageUserRoleType } from '../../../modules/message/enum/message-user-role-type';

@Entity()
export class Review extends BaseEntity {
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
  tagetUserName: string;

  @Column({ name: 'score' })
  score: number;

  @Column({ name: 'description' })
  description: string;
}

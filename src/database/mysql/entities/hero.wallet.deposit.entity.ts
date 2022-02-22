import { Column, Entity, Generated } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class HeroWalletDeposit extends BaseEntity {
  constructor(
    userUuid: string,
    taskUuid: string,
    messageGroupId: string,
    heroRewardAmt: number,
  ) {
    super();
    this.userUuid = userUuid;
    this.taskUuid = taskUuid;
    this.messageGroupId = messageGroupId;
    this.heroRewardAmt = heroRewardAmt;
  }
  @Column({ name: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'task_uuid' })
  taskUuid: string;

  @Column({ name: 'message_group_id' })
  messageGroupId: string;

  @Column({ name: 'hero_reward_amt' })
  heroRewardAmt: number;
}

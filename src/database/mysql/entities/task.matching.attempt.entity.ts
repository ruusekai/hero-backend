import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TaskMatchingAttemptStatus } from '../../../modules/task/enum/matching-attempt-status';
import { Task } from './task.entity';

@Entity()
export class TaskMatchingAttempt extends BaseEntity {
  constructor(
    messageGroupId: string,
    taskUuid: string,
    heroUserUuid: string,
    heroName: string,
    bossUserUuid: string,
    bossName: string,
    isMatched: boolean,
    status: TaskMatchingAttemptStatus,
    isMessageGroupActive: boolean,
  ) {
    super();
    this.messageGroupId = messageGroupId;
    this.taskUuid = taskUuid;
    this.heroUserUuid = heroUserUuid;
    this.heroName = heroName;
    this.bossUserUuid = bossUserUuid;
    this.bossName = bossName;
    this.isMatched = isMatched;
    this.status = status;
    this.isMessageGroupActive = isMessageGroupActive;
  }
  //primary_key of the table
  @Column({ name: 'message_group_id' })
  messageGroupId: string;

  @Column({ name: 'task_uuid' })
  taskUuid: string;

  @Column({ name: 'hero_user_uuid' })
  heroUserUuid: string;

  @Column({ name: 'hero_name' })
  heroName: string;

  @Column({ name: 'boss_user_uuid' })
  bossUserUuid: string;

  @Column({ name: 'boss_name' })
  bossName: string;

  @Column({ name: 'is_matched' })
  isMatched: boolean;

  @Column({ name: 'status' })
  status: TaskMatchingAttemptStatus;

  @Column({ name: 'is_message_group_active' })
  isMessageGroupActive: boolean;

  @Column({ name: 'is_hero_reviewed' })
  isHeroReviewed: boolean;

  @Column({ name: 'is_boss_reviewed' })
  isBossReviewed: boolean;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'task_uuid', referencedColumnName: 'uuid' })
  task: Task;
}

import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Task } from './task.entity';

@Entity()
export class AdminPinnedTask extends BaseEntity {
  @Column({ name: 'task_uuid' })
  taskUuid: string;

  @Column({ name: 'seq' })
  seq: number;

  @OneToOne(() => Task)
  @JoinColumn({ name: 'task_uuid', referencedColumnName: 'uuid' })
  task: Task;
}

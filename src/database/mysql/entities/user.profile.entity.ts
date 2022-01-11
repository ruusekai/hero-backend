import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class UserProfile extends BaseEntity {
  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'icon' })
  icon: string;

  @Column({ name: 'self_introduction' })
  selfIntroduction: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_uuid', referencedColumnName: 'uuid' })
  user: User;
}

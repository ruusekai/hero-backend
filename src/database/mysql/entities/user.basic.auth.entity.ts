import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class UserBasicAuth extends BaseEntity {
  constructor(username: string, password: string, userUuid: string) {
    super();
    this.userUuid = userUuid;
    this.username = username;
    this.password = password;
  }
  @Column({ name: 'user_uuid', unique: true })
  userUuid: string;

  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'password' })
  password: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_uuid', referencedColumnName: 'uuid' })
  user: User;
}

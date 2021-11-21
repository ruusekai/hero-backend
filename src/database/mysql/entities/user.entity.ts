import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
// export class User extends BaseEntity {
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'username', length: 20 })
  username: string;

  @Column({ name: 'password', length: 20 })
  password: string;
}

import {
  Column,
  CreateDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Column({ name: 'status', default: 'NORMAL' })
  status: string;

  @VersionColumn({ name: 'version' })
  version: number;

  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;
}

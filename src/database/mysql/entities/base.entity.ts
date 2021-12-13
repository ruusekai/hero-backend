import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @VersionColumn({ name: 'version' })
  version: number;

  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;

  @Column({
    name: 'created_by',
    type: 'uuid',
    default: '00000000-0000-0000-0000-000000000000',
  })
  createdBy: string;

  @Column({
    name: 'updated_by',
    type: 'uuid',
    default: '00000000-0000-0000-0000-000000000000',
  })
  updatedBy: string;
}

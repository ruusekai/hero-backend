import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class Bank {
  @PrimaryColumn({ name: 'code' })
  code: string;

  @Column({ name: 'zh_name' })
  zhName: string;

  @Column({ name: 'en_name' })
  enName: string;

  @Column({ name: 'is_virtual_bank' })
  isVirtualBank: boolean;

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

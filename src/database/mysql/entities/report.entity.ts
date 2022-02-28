import { Column, Entity, Generated } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ReportType } from '../../../modules/report/enum/report.type';

@Entity()
export class Report extends BaseEntity {
  constructor(
    userUuid: string,
    type: ReportType,
    refId: string,
    description: string,
  ) {
    super();
    this.userUuid = userUuid;
    this.type = type;
    this.refId = refId;
    this.description = description;
  }
  @Column({ name: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'type' })
  type: ReportType;

  @Column({ name: 'ref_id' })
  refId: string;

  @Column({ name: 'description' })
  description: string;
}

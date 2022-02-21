import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PushTemplateName } from '../../../common/enum/push.template.name';
import { PushLanding } from '../../../utils/push/enum/push-landing';

@Entity()
export class PushTemplate extends BaseEntity {
  @Column({ name: 'name' })
  name: PushTemplateName;

  @Column({ name: 'heading' })
  heading: string;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'landing' })
  landing: PushLanding;
}

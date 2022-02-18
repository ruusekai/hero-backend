import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class PushAudience extends BaseEntity {
  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'player_id' })
  playerId: string;

  @Column({ name: 'language' })
  language: string;

  @Column({ name: 'device_type' })
  deviceType: number;
}

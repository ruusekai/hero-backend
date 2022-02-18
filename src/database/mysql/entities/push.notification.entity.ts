import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class PushNotification extends BaseEntity {
  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'player_ids', type: 'json' })
  playerIds: any;

  @Column({ name: 'is_success' })
  isSuccess: boolean;

  @Column({ name: 'push_id' })
  pushId: string;

  @Column({ name: 'push_message' })
  pushMessage: string;

  @Column({ name: 'one_signal_rsp' })
  oneSignalRsp: string;
}

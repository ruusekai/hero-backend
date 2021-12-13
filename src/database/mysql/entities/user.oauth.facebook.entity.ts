import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class UserOauthFacebook extends BaseEntity {
  constructor(
    userUuid: string,
    facebookId: string,
    email: string,
    name: string,
  ) {
    super();
    this.userUuid = userUuid;
    this.facebookId = facebookId;
    this.email = email;
    this.name = name;
  }
  @Column({ name: 'user_uuid', unique: true })
  userUuid: string;

  @Column({ name: 'facebook_id', unique: true })
  facebookId: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'name' })
  name: string;
}

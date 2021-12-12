import { Entity, Column, Generated } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class UserOauthFacebook extends BaseEntity {
  constructor(uuid: string, facebookId: string, email: string, name: string) {
    super();
    this.uuid = uuid;
    this.facebookId = facebookId;
    this.email = email;
    this.name = name;
  }
  @Column({ name: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'facebook_id', unique: true })
  facebookId: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'name' })
  name: string;
}

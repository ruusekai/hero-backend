import { Entity, Column, Generated } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AuthSmsTokenType } from '../../../modules/auth/enum/auth.sms.token.type';
import { UserAuthType } from './user.entity';

@Entity()
export class UserOauthLoginNonce extends BaseEntity {
  constructor(authType: UserAuthType, expiryDate: Date) {
    super();
    this.authType = authType;
    this.expiryDate = expiryDate;
  }

  @Column({ name: 'auth_type' })
  authType: UserAuthType;

  @Column({ name: 'nonce' })
  @Generated('uuid')
  nonce: string;

  @Column({ name: 'expiry_date' })
  expiryDate: Date;
}

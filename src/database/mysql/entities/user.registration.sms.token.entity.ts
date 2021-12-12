import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AuthSmsTokenType } from '../../../modules/auth/enum/auth.sms.token.type';

@Entity()
export class UserRegistrationSmsToken extends BaseEntity {
  @Column({ name: 'mobile' })
  mobile: string;

  @Column({ name: 'type' })
  type: AuthSmsTokenType;

  @Column({ name: 'token' })
  token: string;

  @Column({ name: 'expiry_date' })
  expiryDate: Date;
}

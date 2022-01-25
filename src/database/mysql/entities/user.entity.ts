import { Column, Entity, Generated } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AppLanguage } from '../../../common/enum/app.language';

export enum UserAuthType {
  BASIC = 'basic',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

@Entity()
export class User extends BaseEntity {
  constructor(
    authType: UserAuthType,
    mobile: string,
    email: string,
    isBoss: boolean,
    isHero: boolean,
  ) {
    super();
    this.authType = authType;
    this.mobile = mobile;
    this.email = email;
    this.isBoss = isBoss;
    this.isHero = isHero;
  }

  @Column({ name: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'stripe_customer_id' })
  stripeCustomerId: string;

  @Column({ name: 'auth_type' })
  authType: UserAuthType;

  @Column({ name: 'mobile', unique: true })
  mobile: string;

  @Column({ name: 'email' })
  email: string;

  //from oauth/kyc
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'is_boss' })
  isBoss: boolean;

  @Column({ name: 'is_hero' })
  isHero: boolean;

  @Column({ name: 'is_kyc' })
  isKyc: boolean;

  @Column({ name: 'last_login_date' })
  lastLoginDate: Date;

  @Column({ name: 'last_login_ip' })
  lastLoginIp: string;

  @Column({ name: 'lang' })
  lang: AppLanguage;
}

import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class UserOauthGoogle extends BaseEntity {
  constructor(
    userUuid: string,
    sub: string,
    email: string,
    emailVerified: boolean,
    name: string,
    picture: string,
    givenName: string,
    familyName: string,
    locale: string,
  ) {
    super();
    this.userUuid = userUuid;
    this.sub = sub;
    this.email = email;
    this.emailVerified = emailVerified;
    this.name = name;
    this.picture = picture;
    this.givenName = givenName;
    this.familyName = familyName;
    this.locale = locale;
  }
  @Column({ name: 'user_uuid', unique: true })
  userUuid: string;

  @Column({ name: 'sub', unique: true })
  sub: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'email_verified' })
  emailVerified: boolean;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'picture' })
  picture: string;

  @Column({ name: 'given_name' })
  givenName: string;

  @Column({ name: 'family_name' })
  familyName: string;

  @Column({ name: 'locale' })
  locale: string;
}

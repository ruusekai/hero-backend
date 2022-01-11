import {
  User,
  UserAuthType,
} from '../../../../database/mysql/entities/user.entity';
import { AppLanguage } from '../../../../common/enum/app.language';
export class UserBasicInfoDto {}

export class UserInfoRspDto {
  constructor(user: User) {
    this.uuid = user.uuid;
    this.authType = user.authType;
    this.mobile = user.mobile;
    this.email = user.email;
    this.isBoss = user.isBoss;
    this.isHero = user.isHero;
    this.isKyc = user.isKyc;
    this.lastLoginDate = user.lastLoginDate;
    this.lastLoginIp = user.lastLoginIp;
    this.lang = user.lang;
  }
  uuid: string;
  authType: UserAuthType;
  mobile: string;
  email: string;
  isBoss: boolean;
  isHero: boolean;
  isKyc: boolean;
  lastLoginDate: Date;
  lastLoginIp: string;
  lang: AppLanguage;
}

export class UserProfileRspDto {
  constructor(
    uuid: string,
    isBoss: boolean,
    isHero: boolean,
    isKyc: boolean,
    icon: string,
    selfIntroduction: string,
  ) {
    this.uuid = uuid;
    this.isBoss = isBoss;
    this.isHero = isHero;
    this.isKyc = isKyc;
    this.icon = icon;
    this.selfIntroduction = selfIntroduction;
  }
  uuid: string;
  isBoss: boolean;
  isHero: boolean;
  isKyc: boolean;
  icon: string;
  selfIntroduction: string;
}

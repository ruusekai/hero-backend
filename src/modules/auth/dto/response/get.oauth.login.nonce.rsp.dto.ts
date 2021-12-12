import { UserAuthType } from '../../../../database/mysql/entities/user.entity';

export class GetOauthLoginNonceRspDto {
  constructor(authType: UserAuthType, nonce: string, expiryDate: Date) {
    this.authType = authType;
    this.nonce = nonce;
    this.expiryDate = expiryDate;
  }
  authType: UserAuthType;
  nonce: string;
  expiryDate: Date;
}

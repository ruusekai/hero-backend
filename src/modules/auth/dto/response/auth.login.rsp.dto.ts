export class AuthLoginRspDto {
  constructor(authType: string, userUuid: string, accessToken: string) {
    this.authType = authType;
    this.userUuid = userUuid;
    this.accessToken = accessToken;
  }
  authType: string;
  userUuid: string;
  accessToken: string;
}

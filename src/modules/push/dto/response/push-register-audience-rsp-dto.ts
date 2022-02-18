export class PushRegisterAudienceRspDto {
  constructor(
    userUuid: string,
    playerId: string,
    language: string,
    deviceType: number,
  ) {
    this.userUuid = userUuid;
    this.playerId = playerId;
    this.language = language;
    this.deviceType = deviceType;
  }
  userUuid: string;
  playerId: string;
  language: string;
  deviceType: number;
}

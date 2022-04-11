import { IsNotEmpty } from 'class-validator';

export class PushRegisterAudienceReqDto {
  @IsNotEmpty()
  playerId: string;
}

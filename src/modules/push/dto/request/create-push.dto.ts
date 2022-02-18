import { PushLanding } from '../../../../utils/push/enum/push-landing';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePushDto {
  @IsNotEmpty()
  heading: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  landing: PushLanding;

  @IsOptional()
  landingRefId: string;
}

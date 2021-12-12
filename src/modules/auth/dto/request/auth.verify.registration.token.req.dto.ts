import { IsNotEmpty } from 'class-validator';

export class AuthVerifyRegistrationTokenReqDto {
  @IsNotEmpty()
  token: string;
}

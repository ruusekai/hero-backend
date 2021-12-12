import { IsNotEmpty } from 'class-validator';

export class AuthRegistrationVerifySmsValidateReqDto {
  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  token: string;
}

import { IsNotEmpty } from 'class-validator';

export class AuthVerifySmsValidateReqDto {
  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  token: string;
}

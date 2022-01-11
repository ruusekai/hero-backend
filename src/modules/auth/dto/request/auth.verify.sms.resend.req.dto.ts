import { IsNotEmpty } from 'class-validator';

export class AuthVerifySmsResendReqDto {
  @IsNotEmpty()
  mobile: string;
}

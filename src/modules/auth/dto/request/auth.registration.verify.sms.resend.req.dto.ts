import { IsNotEmpty } from 'class-validator';

export class AuthRegistrationVerifySmsResendReqDto {
  @IsNotEmpty()
  mobile: string;
}

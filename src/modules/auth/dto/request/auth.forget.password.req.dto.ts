import { IsNotEmpty } from 'class-validator';

export class AuthForgetPasswordReqDto {
  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  token: string;
}

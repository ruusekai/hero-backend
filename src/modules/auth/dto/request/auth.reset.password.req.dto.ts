import { IsNotEmpty } from 'class-validator';

export class AuthResetPasswordReqDto {
  @IsNotEmpty()
  newPassword: string;
}

import { IsNotEmpty, IsOptional } from 'class-validator';

export class AuthRegistrationByBasicAuthReqDto {
  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  token: string;

  @IsOptional()
  email: string;
}

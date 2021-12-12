import { IsNotEmpty } from 'class-validator';

export class AuthLoginByBasicAuthReqDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}

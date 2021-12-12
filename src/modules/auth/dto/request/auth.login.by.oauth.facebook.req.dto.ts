import { IsNotEmpty } from 'class-validator';

export class AuthLoginByOauthFacebookReqDto {
  @IsNotEmpty()
  accessToken: string;
}

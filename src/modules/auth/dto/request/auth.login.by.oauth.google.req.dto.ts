import { IsNotEmpty, IsOptional } from 'class-validator';

export class AuthLoginByOauthGoogleReqDto {
  @IsNotEmpty()
  idToken: string;
  @IsOptional()
  accessToken: string;
}

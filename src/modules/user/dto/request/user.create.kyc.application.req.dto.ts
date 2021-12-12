import { IsNotEmpty } from 'class-validator';

export class UserCreateKycApplicationReqDto {
  @IsNotEmpty()
  user_uuid: string;

  @IsNotEmpty()
  image: string;
}

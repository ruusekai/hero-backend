import { IsOptional } from 'class-validator';

export class UserPatchUserReqDto {
  @IsOptional()
  icon: string;

  @IsOptional()
  email: string;

  @IsOptional()
  selfIntroduction: string;

  @IsOptional()
  newMobile: string;

  @IsOptional()
  token: string;
}

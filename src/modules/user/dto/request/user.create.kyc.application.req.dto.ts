import { IsNotEmpty } from 'class-validator';

export class UserCreateKycApplicationReqDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  fileUuid: string;

  @IsNotEmpty()
  kycIdNumber: string;
}

import { IsNotEmpty } from 'class-validator';

export class UserCreateKycApplicationReqDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  kycIdFileUuid: string;

  @IsNotEmpty()
  selfieFileUuid: string;

  @IsNotEmpty()
  kycIdNumber: string;
}

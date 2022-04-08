import { IsNotEmpty } from 'class-validator';

export class UserCreateBankApplicationReqDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  bankingCardFileUuid: string;

  @IsNotEmpty()
  bankCode: string;

  @IsNotEmpty()
  bankNumber: string;
}

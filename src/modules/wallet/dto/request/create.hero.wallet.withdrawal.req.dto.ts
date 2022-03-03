import { IsNotEmpty } from 'class-validator';

export class CreateHeroWalletWithdrawalReqDto {
  @IsNotEmpty()
  amount: number;
}

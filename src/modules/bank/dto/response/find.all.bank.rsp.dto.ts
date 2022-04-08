import { BankDto } from '../entity/bank.dto';

export class FindAllBankRspDto {
  constructor(banks: BankDto[]) {
    this.banks = banks;
  }
  banks: BankDto[];
}

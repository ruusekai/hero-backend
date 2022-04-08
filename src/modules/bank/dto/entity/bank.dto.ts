import { Bank } from '../../../../database/mysql/entities/bank.entity';

export class BankDto {
  constructor(entity: Bank) {
    this.code = entity.code;
    this.zhName = entity.zhName;
    this.enName = entity.enName;
    this.isVirtualBank = entity.isVirtualBank;
  }
  code: string;
  zhName: string;
  enName: string;
  isVirtualBank: boolean;
}

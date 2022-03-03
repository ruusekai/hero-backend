export class GetHeroWalletBalanceRspDto {
  constructor(balance: number, processingWithdrawalAmt: number) {
    this.balance = balance;
    this.processingWithdrawalAmt = processingWithdrawalAmt;
  }
  balance: number;
  processingWithdrawalAmt: number;
}

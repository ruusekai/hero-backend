import { Controller, Get, Request } from '@nestjs/common';
import { WalletManager } from './wallet.manager';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletManager: WalletManager) {}

  @Get('hero/balance')
  getHeroWalletBalance(@Request() req) {
    return this.walletManager.getHeroWalletBalance(req.user.uuid);
  }

  @Get('hero/history')
  listHeroWalletHistory(@Request() req) {
    return this.walletManager.listHeroWalletHistory(req.user.uuid);
  }
}

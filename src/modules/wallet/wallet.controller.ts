import { Controller, Get, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  testing(@Request() req) {
    return this.walletService.sumHeroWalletBalance(req.user.uuid);
  }
}

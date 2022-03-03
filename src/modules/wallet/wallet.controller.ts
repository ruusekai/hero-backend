import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { WalletManager } from './wallet.manager';
import { CreateHeroWalletWithdrawalReqDto } from './dto/request/create.hero.wallet.withdrawal.req.dto';

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

  @Post('hero/withdrawal-request')
  createHeroWalletWithdrawalRequest(
    @Request() req,
    @Body() request: CreateHeroWalletWithdrawalReqDto,
  ) {
    return this.walletManager.createHeroWalletWithdrawalRequest(
      request.amount,
      req.user.uuid,
    );
  }
}

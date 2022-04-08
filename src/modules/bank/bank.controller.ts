import { Controller, Get } from '@nestjs/common';
import { BankManager } from './bank.manager';

@Controller('bank')
export class BankController {
  constructor(private readonly bankManager: BankManager) {}

  @Get()
  findAll() {
    return this.bankManager.findAll();
  }
}

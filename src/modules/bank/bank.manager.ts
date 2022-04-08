import { Injectable } from '@nestjs/common';
import { Bank } from '../../database/mysql/entities/bank.entity';
import { BankService } from './bank.service';
import { AppResponse } from '../../common/response/app.response';
import { BankDto } from './dto/entity/bank.dto';
import { FindAllBankRspDto } from './dto/response/find.all.bank.rsp.dto';

@Injectable()
export class BankManager {
  constructor(private readonly bankService: BankService) {}
  async findAll(): Promise<AppResponse> {
    const bankList: Bank[] = await this.bankService.findAll();
    const bankDtoList: BankDto[] = bankList.map((entity) => {
      return new BankDto(entity);
    });
    const rsp = new FindAllBankRspDto(bankDtoList);
    return new AppResponse(rsp);
  }
}

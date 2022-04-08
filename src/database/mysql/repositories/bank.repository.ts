import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { Bank } from '../entities/bank.entity';

@EntityRepository(Bank)
@Injectable()
export class BankRepository extends Repository<Bank> {
  constructor() {
    super();
  }

  async findAllBank(): Promise<Bank[]> {
    try {
      return await this.find({ isDeleted: false });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

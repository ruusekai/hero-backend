import { Injectable } from '@nestjs/common';
import { BankRepository } from '../../database/mysql/repositories/bank.repository';
import { Bank } from '../../database/mysql/entities/bank.entity';

@Injectable()
export class BankService {
  constructor(private readonly bankRepository: BankRepository) {}
  findAll(): Promise<Bank[]> {
    return this.bankRepository.findAllBank();
  }
}

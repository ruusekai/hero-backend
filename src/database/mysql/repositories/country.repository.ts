import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { Country } from '../entities/country.entity';

@EntityRepository(Country)
@Injectable()
export class CountryRepository extends Repository<Country> {
  constructor() {
    super();
  }

  async findOneCountryByIdAndIsDeletedFalse(id: string): Promise<Country> {
    try {
      return await this.findOne({ id: id, isDeleted: false });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findAllCountry(): Promise<Country[]> {
    try {
      return await this.find({ isDeleted: false });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

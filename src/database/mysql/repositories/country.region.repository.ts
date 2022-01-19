import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { CountryRegion } from '../entities/country.region.entity';

@EntityRepository(CountryRegion)
@Injectable()
export class CountryRegionRepository extends Repository<CountryRegion> {
  constructor() {
    super();
  }

  async findOneRegionByIdAndIsDeletedFalse(id: string): Promise<CountryRegion> {
    try {
      return await this.findOne({ id: id, isDeleted: false });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findRegionListByCountryIdAndIsDeletedFalse(
    countryId: string,
  ): Promise<CountryRegion[]> {
    try {
      return await this.find({ countryId: countryId, isDeleted: false });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { CountryDistrict } from '../entities/country.district.entity';

@EntityRepository(CountryDistrict)
@Injectable()
export class CountryDistrictRepository extends Repository<CountryDistrict> {
  constructor() {
    super();
  }

  async findOneDistrictByIdAndIsDeletedFalse(
    id: string,
  ): Promise<CountryDistrict> {
    try {
      return await this.findOne({ id: id, isDeleted: false });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findDistrictListByRegionIdAndIsDeletedFalse(
    regionId: string,
  ): Promise<CountryDistrict[]> {
    try {
      return await this.find({ regionId: regionId, isDeleted: false });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CountryRepository } from '../../database/mysql/repositories/country.repository';
import { CountryRegionRepository } from '../../database/mysql/repositories/country.region.repository';
import { CountryDistrictRepository } from '../../database/mysql/repositories/country.district.repository';
import { FindOneCountryRspDto } from './dto/response/find.one.country.rsp.dto';
import { CountryRegion } from '../../database/mysql/entities/country.region.entity';
import { CountryDistrict } from '../../database/mysql/entities/country.district.entity';
import { DistrictDto } from './dto/entity/district.dto';
import { RegionDto } from './dto/entity/region.dto';
import { CountryDto } from './dto/entity/country.dto';
import { Country } from '../../database/mysql/entities/country.entity';

@Injectable()
export class CountryService {
  constructor(
    private readonly countryRepository: CountryRepository,
    private readonly regionRepository: CountryRegionRepository,
    private readonly districtRepository: CountryDistrictRepository,
  ) {}

  async findOne(id: string): Promise<FindOneCountryRspDto> {
    const countryEntity: Country =
      await this.countryRepository.findOneCountryByIdAndIsDeletedFalse(id);
    const regionEntityList: CountryRegion[] =
      await this.regionRepository.findRegionListByCountryIdAndIsDeletedFalse(
        id,
      );
    const regionDtoList = await Promise.all(
      regionEntityList.map(async (region) => {
        const districtEntityList: CountryDistrict[] =
          await this.districtRepository.findDistrictListByRegionIdAndIsDeletedFalse(
            region.id,
          );
        const districtDtoList: DistrictDto[] = districtEntityList.map(
          (district) => {
            return new DistrictDto(district.id, district.name);
          },
        );
        return new RegionDto(region.id, region.name, districtDtoList);
      }),
    );
    return new FindOneCountryRspDto(
      new CountryDto(countryEntity.id, countryEntity.name, regionDtoList),
    );
  }
}

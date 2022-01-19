import { CountryDto } from '../entity/country.dto';

export class FindOneCountryRspDto {
  constructor(countryRegions: CountryDto) {
    this.countryRegions = countryRegions;
  }
  countryRegions: CountryDto;
}

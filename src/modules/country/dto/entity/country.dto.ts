import { RegionDto } from './region.dto';

export class CountryDto {
  constructor(countryRegionId: string, name: string, regions: RegionDto[]) {
    this.countryRegionId = countryRegionId;
    this.name = name;
    this.regions = regions;
  }
  countryRegionId: string;
  name: string;
  regions: RegionDto[];
}

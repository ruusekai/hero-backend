import { DistrictDto } from './district.dto';

export class RegionDto {
  constructor(regionId: string, name: string, districts: DistrictDto[]) {
    this.regionId = regionId;
    this.name = name;
    this.districts = districts;
  }
  regionId: string;
  name: string;
  districts: DistrictDto[];
}

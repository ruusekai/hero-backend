export class DistrictDto {
  districtId: string;
  name: string;

  constructor(districtId: string, name: string) {
    this.districtId = districtId;
    this.name = name;
  }
}

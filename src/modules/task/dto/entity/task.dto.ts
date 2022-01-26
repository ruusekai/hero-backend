import { TaskCategory } from '../../enum/task.category';

export class TaskDto {
  constructor(
    taskUuid: string,
    bossUserUuid: string,
    category: TaskCategory,
    banner: string,
    title: string,
    basicCostAmt: number,
    heroRewardAmt: number,
    serviceChargeAmt: number,
    totalChargeAmt: number,
    expiryDate: Date,
    description: string,
    regionId: string,
    districtId: string,
    address: string,
    latitude: string,
    longitude: string,
  ) {
    this.taskUuid = taskUuid;
    this.bossUserUuid = bossUserUuid;
    this.category = category;
    this.banner = banner;
    this.title = title;
    this.basicCostAmt = basicCostAmt;
    this.heroRewardAmt = heroRewardAmt;
    this.serviceChargeAmt = serviceChargeAmt;
    this.totalChargeAmt = totalChargeAmt;
    this.expiryDate = expiryDate;
    this.description = description;
    this.regionId = regionId;
    this.districtId = districtId;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
  }
  taskUuid: string;
  bossUserUuid: string;
  category: TaskCategory;
  banner: string;
  title: string;
  basicCostAmt: number;
  heroRewardAmt: number;
  serviceChargeAmt: number;
  totalChargeAmt: number;
  expiryDate: Date;

  description: string;
  regionId: string;
  districtId: string;
  address: string;
  latitude: string;
  longitude: string;
  distance: string;
}

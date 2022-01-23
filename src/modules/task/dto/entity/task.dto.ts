import { TaskCategory } from '../../enum/task.category';
import { Task } from '../../../../database/mysql/entities/task.entity';

export class TaskDto {
  constructor(task: Task) {
    this.taskUuid = task.uuid;
    this.bossUserUuid = task.bossUserUuid;
    this.category = task.category;
    this.banner = task.banner;
    this.title = task.title;
    this.basicCostAmt = task.basicCostAmt;
    this.heroRewardAmt = task.heroRewardAmt;
    this.totalChargeAmt = task.totalChargeAmt;
    this.expiryDate = task.expiryDate;
    this.description = task.description;
    this.regionId = task.regionId;
    this.districtId = task.districtId;
    this.address = task.address;
    this.latitude = task.latitude;
    this.longitude = task.longitude;
  }

  taskUuid: string;
  bossUserUuid: string;
  category: TaskCategory;
  banner: string;
  title: string;
  basicCostAmt: number;
  heroRewardAmt: number;
  totalChargeAmt: number;
  expiryDate: Date;

  description: string;
  regionId: string;
  districtId: string;
  address: string;
  latitude: string;
  longitude: string;
}

import { TaskPaymentStatus } from '../../enum/task.payment.status';
import { AdminApprovalStatus } from '../../../../common/enum/admin.approval.status';
import { AdminDeclineReason } from '../../../../common/enum/admin.decline.reason';
import { TaskPostStatus } from '../../enum/task-post-status';
import { TaskCategory } from '../../enum/task.category';
import { Task } from '../../../../database/mysql/entities/task.entity';

export class TaskDetailDto {
  constructor(task: Task) {
    this.taskUuid = task.uuid;
    this.category = task.category;
    this.bossUserUuid = task.bossUserUuid;
    this.banner = task.banner;
    this.title = task.title;
    this.description = task.description;
    this.regionId = task.regionId;
    this.districtId = task.districtId;
    this.address = task.address;
    this.latitude = task.latitude;
    this.longitude = task.longitude;
    this.expiryDate = task.expiryDate;
    this.basicCostAmt = task.basicCostAmt;
    this.heroRewardAmt = task.heroRewardAmt;
    this.serviceChargeAmt = task.serviceChargeAmt;
    this.totalChargeAmt = task.totalChargeAmt;
    this.currency = task.currency;
    this.adminStatus = task.adminStatus;
    this.declineReason = task.declineReason;
    this.adminRemarks = task.adminRemarks;
    this.paymentStatus = task.paymentStatus;
    this.paymentIntentId = task.paymentIntentId;
    this.postStatus = task.postStatus;
  }
  taskUuid: string;
  category: TaskCategory;
  bossUserUuid: string;
  banner: string;
  title: string;
  description: string;
  regionId: string;
  districtId: string;
  address: string;
  latitude: string;
  longitude: string;
  expiryDate: Date;
  basicCostAmt: number;
  heroRewardAmt: number;
  serviceChargeAmt: number;
  totalChargeAmt: number;
  currency: string;
  adminStatus: AdminApprovalStatus;
  declineReason: AdminDeclineReason;
  adminRemarks: string;
  paymentStatus: TaskPaymentStatus;
  paymentIntentId: string;
  postStatus: TaskPostStatus;
}

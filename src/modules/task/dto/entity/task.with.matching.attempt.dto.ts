import { TaskCategory } from '../../enum/task.category';
import { TaskPostStatus } from '../../enum/task-post-status';
import { TaskMatchingAttemptRspDto } from '../../../task-matching-attempt/dto/entity/task-matching-attempt-rsp-dto';
import { Task } from '../../../../database/mysql/entities/task.entity';
import { AdminApprovalStatus } from '../../../../common/enum/admin.approval.status';
import { TaskPaymentStatus } from '../../enum/task.payment.status';

export class TaskWithMatchingAttemptDto {
  constructor(
    task: Task,
    matchedTaskMatchingAttempt: TaskMatchingAttemptRspDto,
    taskMatchingAttemptList: TaskMatchingAttemptRspDto[],
  ) {
    this.taskUuid = task.uuid;
    this.bossUserUuid = task.bossUserUuid;
    this.heroUserUuid = task.heroUserUuid;
    this.postStatus = task.postStatus;
    this.messageGroupId = task.messageGroupId;
    this.category = task.category;
    this.banner = task.banner;
    this.title = task.title;
    this.basicCostAmt = task.basicCostAmt;
    this.heroRewardAmt = task.heroRewardAmt;
    this.serviceChargeAmt = task.serviceChargeAmt;
    this.adminStatus = task.adminStatus;
    this.paymentStatus = task.paymentStatus;
    this.expiryDate = task.expiryDate;
    this.description = task.description;
    this.regionId = task.regionId;
    this.districtId = task.districtId;
    this.address = task.address;
    this.latitude = task.latitude;
    this.longitude = task.longitude;
    this.matchedTaskMatchingAttempt = matchedTaskMatchingAttempt;
    this.fullTaskMatchingAttemptList = taskMatchingAttemptList;
  }
  taskUuid: string;
  bossUserUuid: string;
  heroUserUuid: string;
  postStatus: TaskPostStatus;
  messageGroupId: string;
  category: TaskCategory;
  banner: string;
  title: string;
  basicCostAmt: number;
  heroRewardAmt: number;
  serviceChargeAmt: number;

  adminStatus: AdminApprovalStatus;
  paymentStatus: TaskPaymentStatus;

  expiryDate: Date;

  description: string;
  regionId: string;
  districtId: string;
  address: string;
  latitude: string;
  longitude: string;
  matchedTaskMatchingAttempt: TaskMatchingAttemptRspDto;
  fullTaskMatchingAttemptList: TaskMatchingAttemptRspDto[];
}

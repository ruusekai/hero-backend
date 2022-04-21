import { Injectable, Logger } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/request/create.task.dto';
import { UserService } from '../user/user.service';
import { AppResponse } from '../../common/response/app.response';
import { PaymentUtil } from '../../utils/payment/payment.util';
import { FindTaskReqDto } from './dto/request/find.task.req.dto';
import { TaskDto } from './dto/entity/task.dto';
import { FindTaskRspDto } from './dto/response/find.task.rsp.dto';
import { PaginateRspDto } from '../../common/dto/response/paginate.rsp.dto';
import { OrderDirection } from './enum/order.direction';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { TaskOrderByColumn } from './enum/task.order.by.column';
import { Task } from '../../database/mysql/entities/task.entity';
import { TaskPostStatus } from './enum/task-post-status';
import { TaskMatchingAttemptStatus } from './enum/matching-attempt-status';
import { TaskMatchingAttempt } from '../../database/mysql/entities/task.matching.attempt.entity';
import { TaskMatchingAttemptService } from '../task-matching-attempt/task-matching-attempt.service';
import { MessageUserRoleType } from '../message/enum/message-user-role-type';
import { PaymentService } from '../payment/payment.service';
import { TaskHistory } from '../../database/mysql/entities/task.history.entity';
import { MatchingHistoryActionType } from './enum/matching-history-action-type';
import { TaskPaymentStatus } from './enum/task.payment.status';
import { TaskMatchingAttemptRspDto } from '../task-matching-attempt/dto/entity/task-matching-attempt-rsp-dto';
import { TaskWithMatchingAttemptDto } from './dto/entity/task.with.matching.attempt.dto';
import { AdminApprovalStatus } from '../../common/enum/admin.approval.status';
import { TaskDetailDto } from './dto/entity/task.detail.dto';
import { EmailUtil } from '../../utils/email/email.util';
import { AdminPinnedTask } from '../../database/mysql/entities/admin.pinned.task.entity';

@Injectable()
export class TaskManager {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly paymentUtil: PaymentUtil,
    private readonly matchingAttemptService: TaskMatchingAttemptService,
    private readonly paymentService: PaymentService,
    private readonly emailUtil: EmailUtil,
  ) {}

  private readonly logger = new Logger(TaskManager.name);

  async create(
    bossUuid: string,
    createTaskDto: CreateTaskDto,
  ): Promise<AppResponse> {
    await this.paymentUtil.verifyTotalChargeAmt(
      createTaskDto.basicCostAmt,
      createTaskDto.heroRewardAmt,
      createTaskDto.serviceChargeAmt,
      createTaskDto.totalChargeAmt,
    );
    //todo; checkings
    const rsp: TaskDto = await this.taskService.create(bossUuid, createTaskDto);

    //save  history
    const historyEntity: TaskHistory = new TaskHistory(
      rsp.taskUuid,
      null,
      rsp.bossUserUuid,
      MessageUserRoleType.BOSS,
      MatchingHistoryActionType.CREATE_TASK,
      null,
      null,
    );
    await this.matchingAttemptService.saveTaskHistory(historyEntity);

    await this.emailUtil.sendTemplateForNewTaskToAdmin(rsp);
    return new AppResponse(rsp);
  }

  async findAllWithQueryOptions(
    findTaskReqDto: FindTaskReqDto,
  ): Promise<AppResponse> {
    let minHeroRewardAmt: number;
    let maxHeroRewardAmt: number;

    const districtIds: string[] = findTaskReqDto.districtIds
      ? findTaskReqDto.districtIds.split(',')
      : null;
    const categories: string[] = findTaskReqDto.categories
      ? findTaskReqDto.categories.split(',')
      : null;
    const currentLocation: string[] = findTaskReqDto.currentLocation
      ? findTaskReqDto.currentLocation.split(',')
      : null;

    if (findTaskReqDto.orderBy === TaskOrderByColumn.DISTANCE) {
      if (currentLocation == null || currentLocation.length !== 2) {
        this.logger.log('invalid location for distance ordering');
        throw new ApiException(
          ResponseCode.STATUS_7005_INVALID_CURRENT_LOCATION,
        );
      }
    }

    if (findTaskReqDto.maxHeroRewardAmt) {
      minHeroRewardAmt = findTaskReqDto.minHeroRewardAmt
        ? findTaskReqDto.minHeroRewardAmt
        : 0;
    }
    if (findTaskReqDto.minHeroRewardAmt) {
      maxHeroRewardAmt = findTaskReqDto.maxHeroRewardAmt
        ? findTaskReqDto.maxHeroRewardAmt
        : 9999999;
    }
    //keyword
    const keywords: string[] = findTaskReqDto.keywords
      ? decodeURI(findTaskReqDto.keywords).split(' ')
      : null;
    this.logger.log(`keywords: ${JSON.stringify(keywords)}`);

    const options: any = {};
    options.districtIds = districtIds;
    options.categories = categories;
    options.minHeroRewardAmt = minHeroRewardAmt;
    options.maxHeroRewardAmt = maxHeroRewardAmt;
    options.latitude = currentLocation ? currentLocation[0] : null;
    options.longitude = currentLocation ? currentLocation[1] : null;
    options.orderBy = findTaskReqDto.orderBy;
    options.orderDirection = findTaskReqDto.orderDirection
      ? findTaskReqDto.orderDirection
      : OrderDirection.ASC;
    options.keywords = keywords;

    const response =
      await this.taskService.findApprovedAndPaidAndAvailableTaskWithRawPaginate(
        options,
        {
          page: findTaskReqDto.page,
          limit: findTaskReqDto.limit,
        },
      );
    this.logger.log('response' + JSON.stringify(response));
    const taskDtoList: TaskDto[] = await Promise.all(
      response.items.map(async (taskRawData) => {
        const taskDto: TaskDto = new TaskDto(
          taskRawData.task_uuid,
          taskRawData.task_boss_user_uuid,
          taskRawData.task_category,
          taskRawData.task_banner,
          taskRawData.task_title,
          taskRawData.task_basic_cost_amt,
          taskRawData.task_hero_reward_amt,
          taskRawData.task_service_charge_amt,
          taskRawData.task_total_charge_amt,
          taskRawData.task_expiry_date,
          taskRawData.task_description,
          taskRawData.task_region_id,
          taskRawData.task_district_id,
          taskRawData.task_address,
          taskRawData.task_latitude,
          taskRawData.task_longitude,
        );
        taskDto.distance = taskRawData.task_distance
          ? Number(taskRawData.task_distance).toFixed(2)
          : null;
        return taskDto;
      }),
    );

    const rsp = new FindTaskRspDto(
      taskDtoList,
      new PaginateRspDto({
        currentPage: response.meta.currentPage,
        itemCount: response.meta.itemCount,
        itemsPerPage: response.meta.itemsPerPage,
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      }),
    );

    return new AppResponse(rsp);
  }

  async findOne(taskUuid: string) {
    const taskEntity: Task = await this.taskService.findOneTaskByUuid(taskUuid);
    const taskDto: TaskDto = new TaskDto(
      taskEntity.uuid,
      taskEntity.bossUserUuid,
      taskEntity.category,
      taskEntity.banner,
      taskEntity.title,
      taskEntity.basicCostAmt,
      taskEntity.heroRewardAmt,
      taskEntity.serviceChargeAmt,
      taskEntity.totalChargeAmt,
      taskEntity.expiryDate,
      taskEntity.description,
      taskEntity.regionId,
      taskEntity.districtId,
      taskEntity.address,
      taskEntity.latitude,
      taskEntity.longitude,
    );

    return new AppResponse(taskDto);
  }

  async cancelTaskByBoss(userUuid: string, taskUuid: string) {
    let taskEntity: Task = await this.taskService.findOneTaskByUuid(taskUuid);
    this.logger.log(
      `[cancelTaskByBoss] trying to cancel posting of task: ${JSON.stringify(
        taskEntity,
      )}`,
    );
    if (taskEntity == null) {
      throw new ApiException(ResponseCode.STATUS_7010_TASK_NOT_EXIST);
    } else if (taskEntity.bossUserUuid !== userUuid) {
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (taskEntity.heroUserUuid != null) {
      this.logger.error(`[cancelTaskByBoss] matched task cannot be cancelled`);
      throw new ApiException(
        ResponseCode.STATUS_7011_MATCHED_TASK_CANNOT_BE_CANCELLED_BY_BOSS,
      );
    }

    //set all matching attempt to boss_cancelled, disable those chatrooms
    const matchingAttemptList: TaskMatchingAttempt[] =
      await this.matchingAttemptService.findTaskMatchingAttemptListByTaskUuid(
        taskUuid,
      );
    //todo: send noti???
    await this.matchingAttemptService.disableMatchingAttemptAndCloseMessageGroupAndCreateHistoryByList(
      matchingAttemptList,
      TaskMatchingAttemptStatus.BOSS_CANCEL_MATCHING,
      MessageUserRoleType.BOSS,
    );

    //set task as post_status = ‘boss-cancelled’
    taskEntity.postStatus = TaskPostStatus.BOSS_CANCEL_MATCHING;
    await this.taskService.saveTask(taskEntity);

    if (taskEntity.paymentIntentId != null) {
      if (Date.now() > taskEntity.expiryDate.getTime()) {
        this.logger.log(
          `[cancelTaskByBoss] task expired, cancelPaymentWithoutCapture, taskUuid: ${taskEntity.id}, paymentIntentId: ${taskEntity.paymentIntentId}`,
        );
        await this.paymentService.cancelPaymentWithoutCapture(taskEntity);
      } else if (
        taskEntity.paymentStatus === TaskPaymentStatus.REQUIRES_PAYMENT_METHOD
      ) {
        this.logger.log(
          `[cancelTaskByBoss] paymentStatus = REQUIRES_PAYMENT_METHOD, cancelPaymentWithoutCapture, taskUuid: ${taskEntity.id}, paymentIntentId: ${taskEntity.paymentIntentId}`,
        );
        taskEntity = await this.paymentService.cancelPaymentWithoutCapture(
          taskEntity,
        );
      } else {
        this.logger.log(
          `[cancelTaskByBoss] task NOT expired, capturePartialPaymentOfCancelledTask, taskUuid: ${taskEntity.id}, paymentIntentId: ${taskEntity.paymentIntentId}`,
        );
        taskEntity =
          await this.paymentService.capturePartialPaymentOfCancelledTask(
            taskEntity,
          );
      }
    }

    //add history
    //save  history
    const historyEntity: TaskHistory = new TaskHistory(
      taskEntity.uuid,
      taskEntity.messageGroupId,
      taskEntity.bossUserUuid,
      MessageUserRoleType.BOSS,
      MatchingHistoryActionType.BOSS_CANCEL_MATCHING,
      null,
      null,
    );
    await this.matchingAttemptService.saveTaskHistory(historyEntity);

    return new AppResponse(taskEntity);
  }

  async listUserHeroTask(userUuid: string) {
    const taskEntityList: Task[] =
      await this.taskService.findTaskByHeroUserUuid(userUuid);
    const rsp: TaskWithMatchingAttemptDto[] = await Promise.all(
      taskEntityList.map(async (entity) => {
        const matchingAttempt: TaskMatchingAttempt =
          await this.matchingAttemptService.findOneTaskMatchingAttemptByMessageGroupId(
            entity.messageGroupId,
          );
        //hero always get 1 and only 1 attempt
        const matchedAttemptDto = new TaskMatchingAttemptRspDto(
          matchingAttempt,
        );
        return new TaskWithMatchingAttemptDto(entity, matchedAttemptDto, [
          matchedAttemptDto,
        ]);
      }),
    );
    return new AppResponse(rsp);
  }

  async listUserBossTask(userUuid: string) {
    const taskEntityList: Task[] =
      await this.taskService.findTaskByBossUserUuid(userUuid);
    const rsp: TaskWithMatchingAttemptDto[] = await Promise.all(
      taskEntityList.map(async (entity) => {
        //get matching entity list
        const matchingAttemptList: TaskMatchingAttempt[] =
          await this.matchingAttemptService.findTaskMatchingAttemptListByTaskUuid(
            entity.uuid,
          );
        //get matching dto list
        const matchingAttemptDtoList: TaskMatchingAttemptRspDto[] =
          matchingAttemptList.map((subEntity) => {
            return new TaskMatchingAttemptRspDto(subEntity);
          });
        //get name of the matched one
        let matchedAttemptDto: TaskMatchingAttemptRspDto = null;
        if (entity.messageGroupId != null) {
          matchedAttemptDto = matchingAttemptDtoList.filter(
            (dto) => dto.messageGroupId === entity.messageGroupId,
          )[0];
        }
        return new TaskWithMatchingAttemptDto(
          entity,
          matchedAttemptDto,
          matchingAttemptDtoList,
        );
      }),
    );
    return new AppResponse(rsp);
  }

  async repostTaskByBoss(userUuid: string, taskUuid: string) {
    const taskEntity: Task = await this.taskService.findOneTaskByUuid(taskUuid);
    this.logger.log(
      `[cancelTaskByBoss] trying to re-posting task: ${JSON.stringify(
        taskEntity,
      )}`,
    );
    //only boss can repost
    //only paid, approved, not-matched, expired task can repost
    if (taskEntity == null) {
      throw new ApiException(ResponseCode.STATUS_7010_TASK_NOT_EXIST);
    } else if (taskEntity.bossUserUuid !== userUuid) {
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (taskEntity.postStatus !== TaskPostStatus.EXPIRED) {
      //check post status
      this.logger.error(
        `[repost] post-status is not expired: ${taskEntity.postStatus}, expiryDate: ${taskEntity.expiryDate}, createdDate: ${taskEntity.createdDate} `,
      );
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (taskEntity.adminStatus !== AdminApprovalStatus.APPROVED) {
      //check post status
      this.logger.error(
        `[repost] post-status is not allowed as admin not approved `,
      );
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (
      //check payment status
      !(
        taskEntity.paymentStatus === TaskPaymentStatus.REQUIRES_CAPTURE ||
        taskEntity.paymentStatus === TaskPaymentStatus.SUCCEEDED
      )
    ) {
      this.logger.error(`[repost] payment not done, can't repost`);
      throw new ApiException(ResponseCode.STATUS_7200_PAYMENT_REQUIRED);
    } else if (taskEntity.heroUserUuid != null) {
      this.logger.error(`[repost] matched task cannot be repost`);
      throw new ApiException(
        ResponseCode.STATUS_7011_MATCHED_TASK_CANNOT_BE_CANCELLED_BY_BOSS,
      );
    }
    //todo: expiry date no UI???
    const newExpiryDate: Date = null;

    let newTask: Task = new Task(
      taskEntity.bossUserUuid,
      taskEntity.banner,
      taskEntity.title,
      taskEntity.description,
      taskEntity.regionId,
      taskEntity.districtId,
      taskEntity.address,
      taskEntity.latitude,
      taskEntity.longitude,
      newExpiryDate,
      taskEntity.basicCostAmt,
      taskEntity.heroRewardAmt,
      taskEntity.serviceChargeAmt,
      taskEntity.totalChargeAmt,
      'HKD',
      taskEntity.adminStatus,
      taskEntity.paymentStatus,
    );
    newTask.paymentIntentId = taskEntity.paymentIntentId;

    newTask = await this.taskService.saveTask(newTask);
    const rsp = new TaskDetailDto(newTask);
    return new AppResponse(rsp);
  }

  async listAdminPinnedTask() {
    const adminPinnedTaskList: AdminPinnedTask[] =
      await this.taskService.findAllAdminPinnedTaskList();

    const rsp: TaskWithMatchingAttemptDto[] = await Promise.all(
      adminPinnedTaskList.map(async (entity) => {
        //get matching entity list
        const matchingAttemptList: TaskMatchingAttempt[] =
          await this.matchingAttemptService.findTaskMatchingAttemptListByTaskUuid(
            entity?.task?.uuid,
          );
        //get matching dto list
        const matchingAttemptDtoList: TaskMatchingAttemptRspDto[] =
          matchingAttemptList.map((subEntity) => {
            return new TaskMatchingAttemptRspDto(subEntity);
          });
        //get name of the matched one
        let matchedAttemptDto: TaskMatchingAttemptRspDto = null;
        if (entity?.task?.messageGroupId != null) {
          matchedAttemptDto = matchingAttemptDtoList.filter(
            (dto) => dto.messageGroupId === entity?.task?.messageGroupId,
          )[0];
        }
        return new TaskWithMatchingAttemptDto(
          entity?.task,
          matchedAttemptDto,
          matchingAttemptDtoList,
        );
      }),
    );
    return new AppResponse(rsp);
  }
}

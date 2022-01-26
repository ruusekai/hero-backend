import { Injectable, Logger } from '@nestjs/common';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/request/update.task.dto';
import { CreateTaskDto } from './dto/request/create.task.dto';
import { UserService } from '../user/user.service';
import { AppResponse } from '../../common/response/app.response';
import { PaymentUtil } from '../../utils/payment/payment.util';
import { FindTaskReqDto } from './dto/request/find.task.req.dto';
import { TaskDto } from './dto/entity/task.dto';
import { FindTaskRspDto } from './dto/response/find.task.rsp.dto';
import { PaginateRspDto } from '../../common/dto/response/paginate.rsp.dto';
import { OrderDirection } from './dto/enum/order.direction';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { TaskOrderByColumn } from './dto/enum/task.order.by.column';

@Injectable()
export class TaskManager {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly paymentUtil: PaymentUtil,
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
    const rsp = await this.taskService.create(bossUuid, createTaskDto);
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

    const response = await this.taskService.findApprovedTaskWithRawPaginate(
      options,
      { page: findTaskReqDto.page, limit: findTaskReqDto.limit },
    );
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

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}

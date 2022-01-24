import { Injectable } from '@nestjs/common';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/request/update.task.dto';
import { CreateTaskDto } from './dto/request/create.task.dto';
import { UserService } from '../user/user.service';
import { AppResponse } from '../../common/response/app.response';
import { PaymentUtil } from '../../utils/payment/payment.util';
import { TaskCategory } from './enum/task.category';
import { FindTaskReqDto } from './dto/request/find.task.req.dto';
import { Task } from '../../database/mysql/entities/task.entity';
import { TaskDto } from './dto/entity/task.dto';
import { FindTaskRspDto } from './dto/response/find.task.rsp.dto';
import { PaginateRspDto } from '../../common/dto/response/paginate.rsp.dto';

@Injectable()
export class TaskManager {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly paymentUtil: PaymentUtil,
  ) {}

  async create(
    bossUuid: string,
    createTaskDto: CreateTaskDto,
  ): Promise<AppResponse> {
    await this.paymentUtil.verifyTotalChargeAmt(
      createTaskDto.basicCostAmt,
      createTaskDto.heroRewardAmt,
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

    const response = await this.taskService.findApprovedTaskWithPaginate(
      options,
      { page: findTaskReqDto.page, limit: findTaskReqDto.limit },
    );
    const taskDtoList: TaskDto[] = await Promise.all(
      response.items.map(async (taskEntity) => {
        return new TaskDto(taskEntity);
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

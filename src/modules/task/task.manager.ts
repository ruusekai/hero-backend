import { Injectable } from '@nestjs/common';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/request/update.task.dto';
import { CreateTaskDto } from './dto/request/create.task.dto';
import { User } from '../../database/mysql/entities/user.entity';
import { UserService } from '../user/user.service';
import { AppResponse } from '../../common/response/app.response';
import { PaymentUtil } from '../../utils/payment/payment.util';

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

  findAll() {
    return `This action returns all task`;
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

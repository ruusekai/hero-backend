import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/request/create.task.dto';
import { Task } from '../../database/mysql/entities/task.entity';
import { TaskDto } from './dto/entity/task.dto';
import { TaskRepository } from '../../database/mysql/repositories/task.repository';
import { AdminApprovalStatus } from '../../common/enum/admin.approval.status';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { TaskPaymentStatus } from './enum/task.payment.status';
import { MessageService } from '../message/message.service';
import { PushService } from '../push/push.service';
import { TaskMatchingAttemptService } from '../task-matching-attempt/task-matching-attempt.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly messageService: MessageService,
    private readonly pushService: PushService,
    private readonly matchingAttemptService: TaskMatchingAttemptService,
  ) {}
  async create(
    bossUserUuid: string,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskDto> {
    let task: Task = new Task(
      bossUserUuid,
      createTaskDto.banner,
      createTaskDto.title,
      createTaskDto.description,
      createTaskDto.regionId,
      createTaskDto.districtId,
      createTaskDto.address,
      createTaskDto.latitude,
      createTaskDto.longitude,
      createTaskDto.expiryDate,
      createTaskDto.basicCostAmt,
      createTaskDto.heroRewardAmt,
      createTaskDto.serviceChargeAmt,
      createTaskDto.totalChargeAmt,
      'HKD',
      AdminApprovalStatus.PENDING,
      TaskPaymentStatus.PENDING,
    );
    task = await this.saveTask(task);
    return new TaskDto(
      task.uuid,
      task.bossUserUuid,
      task.category,
      task.banner,
      task.title,
      task.basicCostAmt,
      task.heroRewardAmt,
      task.serviceChargeAmt,
      task.totalChargeAmt,
      task.expiryDate,
      task.description,
      task.regionId,
      task.districtId,
      task.address,
      task.latitude,
      task.longitude,
    );
  }

  findAll() {
    return `This action returns all task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  async saveTask(task: Task): Promise<Task> {
    return await this.taskRepository.saveTask(task);
  }

  async findApprovedAndPaidAndAvailableTaskWithRawPaginate(
    queryInput: any,
    iPaginationOptions: IPaginationOptions,
  ): Promise<any> {
    return await this.taskRepository.findApprovedAndPaidAndAvailableTaskByQueryInputAndIsDeletedFalseWithPaginate(
      queryInput,
      iPaginationOptions,
    );
  }

  async findOneTaskByUuid(taskUuid: string): Promise<Task> {
    return await this.taskRepository.findOneTaskByUuidAndIsDeletedFalse(
      taskUuid,
    );
  }

  async findTaskByHeroUserUuid(heroUserUuid: string): Promise<Task[]> {
    return await this.taskRepository.findTaskByHeroUserUuid(heroUserUuid);
  }

  async findTaskByBossUserUuid(bossUserUuid: string): Promise<Task[]> {
    return await this.taskRepository.findTaskByBossUserUuid(bossUserUuid);
  }
}

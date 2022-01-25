import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './dto/request/update.task.dto';
import { CreateTaskDto } from './dto/request/create.task.dto';
import { Task } from '../../database/mysql/entities/task.entity';
import { TaskDto } from './dto/entity/task.dto';
import { TaskRepository } from '../../database/mysql/repositories/task.repository';
import { AdminApprovalStatus } from '../../common/enum/admin.approval.status';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { TaskPaymentStatus } from './enum/task.payment.status';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}
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
    return new TaskDto(task);
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

  async saveTask(task: Task): Promise<Task> {
    return await this.taskRepository.saveTask(task);
  }

  async findApprovedTaskWithPaginate(
    queryInput: any,
    iPaginationOptions: IPaginationOptions,
  ) {
    return await this.taskRepository.findApprovedTaskByQueryInputAndIsDeletedFalseWithPaginate(
      queryInput,
      iPaginationOptions,
    );
  }

  async findOneTaskByUuid(taskUuid: string) {
    return await this.taskRepository.findOneTaskByUuidAndIsDeletedFalse(
      taskUuid,
    );
  }
}
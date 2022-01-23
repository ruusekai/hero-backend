import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { Task } from '../entities/task.entity';

@EntityRepository(Task)
@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor() {
    super();
  }

  async findOneTaskByUuidAndIsDeletedFalse(uuid: string): Promise<Task> {
    try {
      return await this.findOne({
        where: { uuid: uuid, isDeleted: false },
        relations: ['bossUser'],
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveTask(Task: Task): Promise<Task> {
    try {
      Task.updatedDate = new Date(Date.now());
      return await this.save(Task);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

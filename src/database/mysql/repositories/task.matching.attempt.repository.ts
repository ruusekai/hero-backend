import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { TaskMatchingAttempt } from '../entities/task.matching.attempt.entity';

@EntityRepository(TaskMatchingAttempt)
@Injectable()
export class TaskMatchingAttemptRepository extends Repository<TaskMatchingAttempt> {
  constructor() {
    super();
  }

  async findTaskMatchingAttemptByTaskUuid(
    taskUuid: string,
  ): Promise<TaskMatchingAttempt[]> {
    try {
      return await this.find({ taskUuid: taskUuid, isDeleted: false });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveOneTaskMatchingAttempt(
    TaskMatchingAttempt: TaskMatchingAttempt,
  ): Promise<TaskMatchingAttempt> {
    try {
      TaskMatchingAttempt.updatedDate = new Date(Date.now());
      return await this.save(TaskMatchingAttempt);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveTaskMatchingAttemptByList(
    entityList: TaskMatchingAttempt[],
  ): Promise<TaskMatchingAttempt[]> {
    try {
      return await this.save(entityList);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

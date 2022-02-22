import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { TaskHistory } from '../entities/task.history.entity';

@EntityRepository(TaskHistory)
@Injectable()
export class TaskHistoryRepository extends Repository<TaskHistory> {
  constructor() {
    super();
  }

  async saveTaskHistory(taskHistory: TaskHistory): Promise<TaskHistory> {
    try {
      taskHistory.updatedDate = new Date(Date.now());
      return await this.save(taskHistory);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

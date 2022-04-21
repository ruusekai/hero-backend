import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { AdminPinnedTask } from '../entities/admin.pinned.task.entity';

@EntityRepository(AdminPinnedTask)
@Injectable()
export class AdminPinnedTaskRepository extends Repository<AdminPinnedTask> {
  constructor() {
    super();
  }

  async findAllAdminPinnedTask(): Promise<AdminPinnedTask[]> {
    try {
      return await this.find({
        where: {
          isDeleted: false,
        },
        order: {
          seq: 'ASC',
        },
        relations: ['task'],
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

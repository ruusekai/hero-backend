import { Injectable } from '@nestjs/common';
import {
  Between,
  EntityRepository,
  FindManyOptions,
  In,
  Repository,
} from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { Task } from '../entities/task.entity';
import { AdminApprovalStatus } from '../../../common/enum/admin.approval.status';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@EntityRepository(Task)
@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor() {
    super();
  }

  async findApprovedTaskByQueryInputAndIsDeletedFalseWithPaginate(
    queryInput: any,
    iPaginationOptions: IPaginationOptions,
  ): Promise<Pagination<Task>> {
    try {
      const options: any = {
        where: {
          adminStatus: AdminApprovalStatus.APPROVED,
          isDeleted: false,
        },
        order: {
          updatedDate: 'DESC',
        },
        relations: ['bossUser'],
      };
      if (queryInput.districtIds) {
        options.where.districtId = In(queryInput.districtIds);
      }
      if (queryInput.categories) {
        options.where.category = In(queryInput.categories);
      }
      if (queryInput.minHeroRewardAmt) {
        options.heroRewardAmt = Between(
          queryInput.minHeroRewardAmt,
          queryInput.maxHeroRewardAmt,
        );
      }
      return await paginate<Task>(this, iPaginationOptions, options);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
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

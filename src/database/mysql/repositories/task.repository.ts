import { Injectable } from '@nestjs/common';
import {
  Between,
  EntityRepository,
  FindManyOptions,
  getManager,
  getRepository,
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
  paginateRaw,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { TaskOrderByColumn } from '../../../modules/task/dto/enum/task.order.by.column';
import { OrderDirection } from '../../../modules/task/dto/enum/order.direction';

@EntityRepository(Task)
@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor() {
    super();
  }
  //
  // async findApprovedTaskByQueryInputAndIsDeletedFalseWithPaginate(
  //   queryInput: any,
  //   iPaginationOptions: IPaginationOptions,
  // ): Promise<Pagination<Task>> {
  //   try {
  //     const options: any = {
  //       where: {
  //         adminStatus: AdminApprovalStatus.APPROVED,
  //         isDeleted: false,
  //       },
  //       order: {},
  //       relations: ['bossUser'],
  //       select: [
  //         `ST_Distance_Sphere(
  //   point(-87.6770458, 41.9631174),
  //   point(longitude, latitude)) `,
  //       ],
  //     };
  //     if (queryInput.districtIds) {
  //       options.where.districtId = In(queryInput.districtIds);
  //     }
  //     if (queryInput.categories) {
  //       options.where.category = In(queryInput.categories);
  //     }
  //     if (queryInput.minHeroRewardAmt) {
  //       options.heroRewardAmt = Between(
  //         queryInput.minHeroRewardAmt,
  //         queryInput.maxHeroRewardAmt,
  //       );
  //     }
  //     if (queryInput.orderBy) {
  //       options.order[queryInput.orderBy] = queryInput.orderDirection;
  //     } else {
  //       options.order.updatedDate = 'DESC';
  //     }
  //     return await paginate<Task>(this, iPaginationOptions, options);
  //   } catch (e) {
  //     console.log(JSON.stringify(e.stack));
  //     throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
  //   }
  // }

  async findApprovedTaskByQueryInputAndIsDeletedFalseWithPaginate(
    queryInput: any,
    iPaginationOptions: IPaginationOptions,
  ) {
    try {
      const queryBuilder = this.createQueryBuilder('task').where(
        'task.adminStatus = :adminStatus',
        { adminStatus: AdminApprovalStatus.APPROVED },
      );

      //ordering
      if (queryInput.orderBy === TaskOrderByColumn.DISTANCE) {
        queryBuilder
          .addSelect(
            `ST_Distance_Sphere(point(${queryInput.longitude}, ${queryInput.latitude}),point(task.longitude, task.latitude))`,
            'task_distance',
          )
          .orderBy('-task_distance', OrderDirection.DESC);
      } else if (queryInput.orderBy != null) {
        queryBuilder.orderBy(
          `task.${queryInput.orderBy}`,
          queryInput.orderDirection,
        );
      } else {
        queryBuilder.orderBy(`task.updatedDate`, OrderDirection.DESC);
      }

      //filtering
      if (queryInput.districtIds) {
        queryBuilder.andWhere('task.districtId IN (:...districtIds)', {
          districtIds: queryInput.districtIds,
        });
      }
      if (queryInput.categories) {
        queryBuilder.andWhere('task.category IN (:...categories)', {
          categories: queryInput.categories,
        });
      }
      if (queryInput.minHeroRewardAmt) {
        queryBuilder.andWhere(
          'task.heroRewardAmt BETWEEN :minHeroRewardAmt AND :maxHeroRewardAmt',
          {
            minHeroRewardAmt: queryInput.minHeroRewardAmt,
            maxHeroRewardAmt: queryInput.maxHeroRewardAmt,
          },
        );
      }

      return await paginateRaw(queryBuilder, iPaginationOptions);
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

import { Injectable } from '@nestjs/common';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { Task } from '../entities/task.entity';
import { AdminApprovalStatus } from '../../../common/enum/admin.approval.status';
import { IPaginationOptions, paginateRaw } from 'nestjs-typeorm-paginate';
import { TaskOrderByColumn } from '../../../modules/task/enum/task.order.by.column';
import { OrderDirection } from '../../../modules/task/enum/order.direction';
import { TaskPaymentStatus } from '../../../modules/task/enum/task.payment.status';
import { TaskPostStatus } from '../../../modules/task/enum/task-post-status';

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

  async findApprovedAndPaidAndAvailableTaskByQueryInputAndIsDeletedFalseWithPaginate(
    queryInput: any,
    iPaginationOptions: IPaginationOptions,
  ) {
    try {
      const queryBuilder = this.createQueryBuilder('task').where(
        'task.adminStatus = :adminStatus',
        { adminStatus: AdminApprovalStatus.APPROVED },
      );
      queryBuilder.andWhere('task.payment_status IN (:...paymentStatus)', {
        paymentStatus: [
          TaskPaymentStatus.REQUIRES_CAPTURE,
          TaskPaymentStatus.SUCCEEDED,
        ],
      });
      queryBuilder.andWhere('task.post_status = :postStatus', {
        postStatus: TaskPostStatus.AVAILABLE,
      });

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
      if (queryInput.keywords) {
        queryInput.keywords.forEach((keyword) => {
          queryBuilder.andWhere(
            new Brackets((qb) => {
              qb.where(
                'task.title like :keyword or task.description like :keyword',
                {
                  keyword: `%${keyword}%`,
                },
              );
            }),
          );
        });
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

  async findTaskByHeroUserUuid(userUuid: string): Promise<Task[]> {
    try {
      return await this.find({
        where: { heroUserUuid: userUuid, isDeleted: false },
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findTaskByBossUserUuid(userUuid: string): Promise<Task[]> {
    try {
      return await this.find({
        where: { bossUserUuid: userUuid, isDeleted: false },
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

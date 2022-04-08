import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { UserBank } from '../entities/user.bank.entity';
import { AdminApprovalStatus } from '../../../common/enum/admin.approval.status';

@EntityRepository(UserBank)
@Injectable()
export class UserBankRepository extends Repository<UserBank> {
  constructor() {
    super();
  }

  async findOneUserBankByUserUuidAndIsDeletedFalseOrderByUpdatedDateDesc(
    userUuid: string,
  ): Promise<UserBank> {
    try {
      return await this.findOne({
        where: { userUuid: userUuid, isDeleted: false },
        relations: ['user'],
        order: {
          updatedDate: 'DESC',
        },
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findOneApprovedUserBankByUserUuidAndIsDeletedFalseOrderByUpdatedDateDesc(
    userUuid: string,
  ): Promise<UserBank> {
    try {
      return await this.findOne({
        where: {
          adminStatus: AdminApprovalStatus.APPROVED,
          userUuid: userUuid,
          isDeleted: false,
        },
        relations: ['user'],
        order: {
          updatedDate: 'DESC',
        },
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveUserBank(UserBank: UserBank): Promise<UserBank> {
    try {
      UserBank.updatedDate = new Date(Date.now());
      return await this.save(UserBank);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

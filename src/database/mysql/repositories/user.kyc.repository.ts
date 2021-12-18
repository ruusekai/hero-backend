import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { UserKyc } from '../entities/user.kyc.entity';

@EntityRepository(UserKyc)
@Injectable()
export class UserKycRepository extends Repository<UserKyc> {
  constructor() {
    super();
  }

  async findOneUserKycByUserUuidAndIsDeletedFalseOrderByUpdatedDateDesc(
    userUuid: string,
  ): Promise<UserKyc> {
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

  async saveUserKyc(UserKyc: UserKyc): Promise<UserKyc> {
    try {
      UserKyc.updatedDate = new Date(Date.now());
      return await this.save(UserKyc);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

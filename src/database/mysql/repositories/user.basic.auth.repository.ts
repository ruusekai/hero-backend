import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { UserBasicAuth } from '../entities/user.basic.auth.entity';
import { ApiException } from '../../../common/exception/api.exception';

@EntityRepository(UserBasicAuth)
@Injectable()
export class UserBasicAuthRepository extends Repository<UserBasicAuth> {
  constructor() {
    super();
  }

  async findOneUserBasicAuthByUsername(
    username: string,
  ): Promise<UserBasicAuth> {
    try {
      return await this.findOne({
        where: { username: username, isDeleted: false },
        relations: ['user'],
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveUserBasicAuth(
    userBasicAuth: UserBasicAuth,
  ): Promise<UserBasicAuth> {
    try {
      userBasicAuth.updatedDate = new Date(Date.now());
      return await this.save(userBasicAuth);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

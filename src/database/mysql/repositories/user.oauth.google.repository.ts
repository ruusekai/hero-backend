import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { UserOauthGoogle } from '../entities/user.oauth.google.entity';

@EntityRepository(UserOauthGoogle)
@Injectable()
export class UserOauthGoogleRepository extends Repository<UserOauthGoogle> {
  constructor() {
    super();
  }

  async findOneUserOauthGoogleBySubAndIsDeletedFalse(
    sub: string,
  ): Promise<UserOauthGoogle> {
    try {
      return await this.findOne({ sub: sub, isDeleted: false });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveUserOauthGoogle(
    userOauthGoogle: UserOauthGoogle,
  ): Promise<UserOauthGoogle> {
    try {
      userOauthGoogle.updatedDate = new Date(Date.now());
      return await this.save(userOauthGoogle);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

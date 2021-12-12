import { Injectable } from '@nestjs/common';
import { EntityRepository, MoreThan, Repository, UpdateResult } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { UserOauthLoginNonce } from '../entities/user.oauth.login.nonce.entity';
import { AuthSmsTokenType } from '../../../modules/auth/enum/auth.sms.token.type';
import { UserAuthType } from '../entities/user.entity';

@EntityRepository(UserOauthLoginNonce)
@Injectable()
export class UserOauthLoginNonceRepository extends Repository<UserOauthLoginNonce> {
  constructor() {
    super();
  }

  async createNonce(token: UserOauthLoginNonce): Promise<UserOauthLoginNonce> {
    try {
      return await this.save(token);
    } catch (e) {
      // throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async deactivateOneNonceByAuthTypeAndNonce(
    authType: UserAuthType,
    nonce: string,
  ): Promise<UpdateResult> {
    try {
      return await this.createQueryBuilder()
        .update(UserOauthLoginNonce)
        .set({
          expiryDate: new Date(Date.now()),
          updatedDate: new Date(Date.now()),
        })
        .where(
          'authType= :authType and nonce= :nonce and expiryDate > current_timestamp and isDeleted = false',
          {
            authType,
            nonce,
          },
        )
        .execute();
    } catch (e) {
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findOneNonceByAuthTypeAndNonceAndIsDeletedFalse(
    authType: UserAuthType,
    nonce: string,
  ): Promise<UserOauthLoginNonce> {
    try {
      return await this.findOne({
        where: {
          authType: UserAuthType,
          nonce: nonce,
          isDeleted: false,
        },
      });
    } catch (e) {
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { EntityRepository, MoreThan, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { AuthSmsTokenType } from '../../../modules/auth/enum/auth.sms.token.type';
import { UserSmsToken } from '../entities/user.sms.token.entity';

@EntityRepository(UserSmsToken)
@Injectable()
export class UserSmsTokenRepository extends Repository<UserSmsToken> {
  constructor() {
    super();
  }

  async createToken(token: UserSmsToken): Promise<UserSmsToken> {
    try {
      return await this.save(token);
    } catch (e) {
      // throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async deactivateExistingTokenByTypeAndMobile(
    type: AuthSmsTokenType,
    mobile: string,
  ) {
    try {
      return await this.createQueryBuilder()
        .update(UserSmsToken)
        .set({
          expiryDate: new Date(Date.now()),
          updatedDate: new Date(Date.now()),
        })
        .where(
          'type= :type and mobile= :mobile and expiryDate > current_timestamp and isDeleted = false',
          {
            type,
            mobile,
          },
        )
        .execute();
    } catch (e) {
      // throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async deactivateOneTokenByTypeAndMobileAndToken(
    type: string,
    mobile: string,
    token: string,
  ) {
    try {
      return await this.createQueryBuilder()
        .update(UserSmsToken)
        .set({
          expiryDate: new Date(Date.now()),
          updatedDate: new Date(Date.now()),
        })
        .where(
          'type= :type and mobile= :mobile and token= :token and expiryDate > current_timestamp and isDeleted = false',
          {
            type,
            mobile,
            token,
          },
        )
        .execute();
    } catch (e) {
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findOneTokenByTypeAndMobileAndTokenAndIsDeletedFalse(
    type: AuthSmsTokenType,
    mobile: string,
    token: string,
  ): Promise<UserSmsToken> {
    try {
      return await this.findOne({
        type: type,
        mobile: mobile,
        token: token,
        isDeleted: false,
      });
    } catch (e) {
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findTokenByTypeAndMobileAndCreatedDateMoreThanAndIsDeletedFalseOrderByCreatedDateDesc(
    type: AuthSmsTokenType,
    mobile: string,
    createdDate: Date,
  ): Promise<UserSmsToken[]> {
    try {
      return await this.find({
        where: {
          type: type,
          mobile: mobile,
          createdDate: MoreThan(createdDate),
          isDeleted: false,
        },
        order: {
          createdDate: 'DESC',
        },
      });
    } catch (e) {
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

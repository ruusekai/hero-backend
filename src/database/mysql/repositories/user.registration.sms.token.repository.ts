import { Injectable } from '@nestjs/common';
import { EntityRepository, MoreThan, Repository } from 'typeorm';
import { UserRegistrationSmsToken } from '../entities/user.registration.sms.token.entity';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';

@EntityRepository(UserRegistrationSmsToken)
@Injectable()
export class UserRegistrationSmsTokenRepository extends Repository<UserRegistrationSmsToken> {
  constructor() {
    super();
  }

  async createToken(
    token: UserRegistrationSmsToken,
  ): Promise<UserRegistrationSmsToken> {
    try {
      return await this.save(token);
    } catch (e) {
      // throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async deactivateExistingTokenByMobile(mobile: string) {
    try {
      return await this.createQueryBuilder()
        .update(UserRegistrationSmsToken)
        .set({
          expiryDate: new Date(Date.now()),
          updatedDate: new Date(Date.now()),
        })
        .where(
          'mobile= :mobile and expiryDate > current_timestamp and isDeleted = false',
          {
            mobile,
          },
        )
        .execute();
    } catch (e) {
      // throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async deactivateOneTokenByMobileAndToken(mobile: string, token: string) {
    try {
      return await this.createQueryBuilder()
        .update(UserRegistrationSmsToken)
        .set({
          expiryDate: new Date(Date.now()),
          updatedDate: new Date(Date.now()),
        })
        .where(
          'mobile= :mobile and token= :token and expiryDate > current_timestamp and isDeleted = false',
          {
            mobile,
            token,
          },
        )
        .execute();
    } catch (e) {
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findOneTokenByMobileAndTokenAndIsDeletedFalse(
    mobile: string,
    token: string,
  ): Promise<UserRegistrationSmsToken> {
    try {
      return await this.findOne({
        mobile: mobile,
        token: token,
        isDeleted: false,
      });
    } catch (e) {
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findTokenByMobileAndCreatedDateMoreThanAndIsDeletedFalseOrderByCreatedDateDesc(
    mobile: string,
    createdDate: Date,
  ): Promise<UserRegistrationSmsToken[]> {
    try {
      return await this.find({
        where: {
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

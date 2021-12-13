import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { UserOauthFacebook } from '../entities/user.oauth.facebook.entity';

@EntityRepository(UserOauthFacebook)
@Injectable()
export class UserOauthFacebookRepository extends Repository<UserOauthFacebook> {
  constructor() {
    super();
  }

  async findOneUserOauthFacebookByFacebookIdAndIsDeletedFalse(
    facebookId: string,
  ): Promise<UserOauthFacebook> {
    try {
      return await this.findOne({ facebookId: facebookId, isDeleted: false });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveUserOauthFacebook(
    userOauthFacebook: UserOauthFacebook,
  ): Promise<UserOauthFacebook> {
    try {
      userOauthFacebook.updatedDate = new Date(Date.now());
      return await this.save(userOauthFacebook);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

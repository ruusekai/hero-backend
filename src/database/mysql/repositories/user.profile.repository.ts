import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { UserProfile } from '../entities/user.profile.entity';

@EntityRepository(UserProfile)
@Injectable()
export class UserProfileRepository extends Repository<UserProfile> {
  constructor() {
    super();
  }

  async findOneUserProfileByUserUuid(userUuid: string): Promise<UserProfile> {
    try {
      return await this.findOne({
        where: { userUuid: userUuid, isDeleted: false },
        relations: ['user'],
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveUserProfile(UserProfile: UserProfile): Promise<UserProfile> {
    try {
      UserProfile.updatedDate = new Date(Date.now());
      return await this.save(UserProfile);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

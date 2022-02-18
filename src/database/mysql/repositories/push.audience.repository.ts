import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { PushAudience } from '../entities/push.audience.entity';

@EntityRepository(PushAudience)
@Injectable()
export class PushAudienceRepository extends Repository<PushAudience> {
  constructor() {
    super();
  }

  async findOnePushAudienceByPlayerId(playerId: string): Promise<PushAudience> {
    try {
      return await this.findOne({
        where: { playerId: playerId, isDeleted: false },
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findPushAudienceListByUserUuid(
    userUuid: string,
  ): Promise<PushAudience[]> {
    try {
      return await this.find({
        where: { userUuid: userUuid, isDeleted: false },
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async savePushAudience(PushAudience: PushAudience): Promise<PushAudience> {
    try {
      PushAudience.updatedDate = new Date(Date.now());
      return await this.save(PushAudience);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { PushNotification } from '../entities/push.notification.entity';

@EntityRepository(PushNotification)
@Injectable()
export class PushNotificationRepository extends Repository<PushNotification> {
  constructor() {
    super();
  }

  async savePushNotification(
    PushNotification: PushNotification,
  ): Promise<PushNotification> {
    try {
      PushNotification.updatedDate = new Date(Date.now());
      return await this.save(PushNotification);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

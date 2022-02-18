import { Injectable } from '@nestjs/common';
import { PushService } from './push.service';
import { CreatePushDto } from './dto/request/create-push.dto';
import { PushAudience } from '../../database/mysql/entities/push.audience.entity';
import { AppResponse } from '../../common/response/app.response';
import { PushRegisterAudienceRspDto } from './dto/response/push-register-audience-rsp-dto';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';

@Injectable()
export class PushManager {
  constructor(private readonly pushService: PushService) {}
  async testPushCreate(userUuid: string, createPushDto: CreatePushDto) {
    const rsp = await this.pushService.createNotification(
      userUuid,
      createPushDto.heading,
      createPushDto.content,
      createPushDto.landing,
      createPushDto.landingRefId,
    );
    return new AppResponse(rsp);
  }

  async registerAudiencePlayerId(playerId: string, userUuid: string) {
    //find if playerId exist in db
    const existingAudience: PushAudience =
      await this.pushService.findOnePushAudienceByPlayerId(playerId);
    if (existingAudience != null) {
      return new AppResponse(
        new PushRegisterAudienceRspDto(
          existingAudience.userUuid,
          existingAudience.playerId,
          existingAudience.language,
          existingAudience.deviceType,
        ),
      );
    }
    //check the playerId on onesignal
    const oneSignalRsp: any = await this.pushService.viewDeviceOnOneSignal(
      playerId,
    );
    if (oneSignalRsp == null) {
      throw new ApiException(ResponseCode.STATUS_8100_ONE_SIGNAL_ERROR);
    }

    //save the playerId as it is new
    const newAudience: PushAudience = new PushAudience();
    newAudience.userUuid = userUuid;
    newAudience.playerId = playerId;
    newAudience.language = oneSignalRsp.language;
    newAudience.deviceType = oneSignalRsp.device_type;
    await this.pushService.savePushAudience(newAudience);

    return new AppResponse(
      new PushRegisterAudienceRspDto(
        newAudience.userUuid,
        newAudience.playerId,
        newAudience.language,
        newAudience.deviceType,
      ),
    );
  }
}

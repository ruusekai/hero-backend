import { Injectable, Logger } from '@nestjs/common';
import { PushLanding } from '../../utils/push/enum/push-landing';
import { PushUtil } from '../../utils/push/push.util';
import { PushAudienceRepository } from '../../database/mysql/repositories/push.audience.repository';
import { PushAudience } from '../../database/mysql/entities/push.audience.entity';
import { PushNotification } from '../../database/mysql/entities/push.notification.entity';
import { PushMessageDto } from '../../utils/push/dto/entity/push-message-dto';
import { ConfigService } from '@nestjs/config';
import { PushNotificationRepository } from '../../database/mysql/repositories/push.notification.repository';
import { PushTemplateName } from '../../common/enum/push.template.name';
import { PushTemplateRepository } from '../../database/mysql/repositories/push.template.repository';
import { PushTemplate } from '../../database/mysql/entities/push.template.entity';

@Injectable()
export class PushService {
  private readonly appId;

  constructor(
    private readonly configService: ConfigService,
    private readonly pushUtil: PushUtil,
    private readonly pushAudienceRepository: PushAudienceRepository,
    private readonly pushNotificationRepository: PushNotificationRepository,
    private readonly pushTemplateRepository: PushTemplateRepository,
  ) {
    this.appId = this.configService.get<string>('push.ONE_SIGNAL_APP_ID');
  }

  private readonly logger = new Logger(PushService.name);

  async createNotificationByTemplate(
    userUuid: string,
    templateName: PushTemplateName,
    landingRefId: string,
    customContent: string = null,
  ) {
    const template: PushTemplate = await this.findOnePushTemplateByName(
      templateName,
    );
    if (template == null) {
      this.logger.error(
        '[PushService][createNotificationByTemplate] template not found!',
      );
    }
    await this.createNotification(
      userUuid,
      template.heading,
      customContent == null ? template.content : customContent,
      template.landing,
      landingRefId,
    );
  }

  async createNotification(
    userUuid: string,
    heading: string,
    content: string,
    landing: PushLanding,
    landingRefId: string,
  ) {
    //get playerIdList by userUuid
    const pushAudienceList: PushAudience[] =
      await this.pushAudienceRepository.findPushAudienceListByUserUuid(
        userUuid,
      );
    if (pushAudienceList == null || pushAudienceList.length == 0) {
      this.logger.log(
        `[pushService][createNotification] empty push audience, skip push`,
      );
      return false;
    }

    const playerIdList = pushAudienceList.map((entity) => {
      return entity.playerId;
    });

    //prepare message
    const headingObj = { en: heading };
    const contentObj = { en: content };
    const customData = { landing: landing, refId: landingRefId };
    const pushMessage = new PushMessageDto(
      this.appId,
      playerIdList,
      headingObj,
      contentObj,
      customData,
    );
    this.logger.log(
      '[PushService][createNotification] pushMessage: ' +
        JSON.stringify(pushMessage),
    );

    //send notification
    let pushResult: boolean;
    let rsp;
    try {
      rsp = await this.pushUtil.createNotification(pushMessage);
      pushResult = rsp.errors == null ? true : false;
    } catch (e) {
      this.logger.error(e.stack);
      pushResult = false;
    }

    //save rsp to db
    const pushNotification: PushNotification = new PushNotification();
    pushNotification.userUuid = userUuid;
    pushNotification.playerIds = playerIdList;
    pushNotification.isSuccess = pushResult;
    pushNotification.pushId = rsp == null ? null : rsp.id;
    pushNotification.pushMessage = JSON.stringify(pushMessage);
    pushNotification.oneSignalRsp = JSON.stringify(rsp);
    await this.savePushNotification(pushNotification);

    return rsp;
  }

  async findOnePushAudienceByPlayerId(playerId: string): Promise<PushAudience> {
    return await this.pushAudienceRepository.findOnePushAudienceByPlayerId(
      playerId,
    );
  }

  async savePushAudience(entity: PushAudience): Promise<PushAudience> {
    return await this.pushAudienceRepository.savePushAudience(entity);
  }

  async savePushNotification(
    entity: PushNotification,
  ): Promise<PushNotification> {
    return await this.pushNotificationRepository.savePushNotification(entity);
  }

  async viewDeviceOnOneSignal(playerId: string) {
    return await this.pushUtil.viewDevice(playerId);
  }

  async findOnePushTemplateByName(name: PushTemplateName) {
    return await this.pushTemplateRepository.findOnePushTemplateByName(name);
  }
}

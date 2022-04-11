import { PushUtilModule } from '../../../utils/push/push.util.module';
import { PushController } from '../push.controller';
import { PushManager } from '../push.manager';
import { ContextIdFactory } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { PushService } from '../push.service';
import { AppResponse } from '../../../common/response/app.response';
import { PushRegisterAudienceReqDto } from '../dto/request/push-register-audience-req-dto';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../../../config/app.config';
import { PushAudience } from '../../../database/mysql/entities/push.audience.entity';
import { ResponseCode } from '../../../common/response/response.code';

describe('UserController - Unit Test', () => {
  let pushManager: PushManager;
  const pushService = {
    findOnePushAudienceByPlayerId: () => {},
    viewDeviceOnOneSignal: () => {},
    savePushAudience: () => {},
  };

  //Unit Test Module Setup
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PushUtilModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig],
        }),
      ],
      controllers: [],
      providers: [
        PushManager,
        {
          provide: PushService,
          useValue: pushService,
        },
      ],
    }).compile();
    //Get Request Scope Module
    const contextId = ContextIdFactory.create();
    jest
      .spyOn(ContextIdFactory, 'getByRequest')
      .mockImplementation(() => contextId);
    pushManager = await moduleRef.resolve(PushManager, contextId);
  });

  describe('Function : registerAudiencePlayerId', () => {
    const userUuid = '00000000-0000-0000-0000-000000000000';
    const playerId = 'testingPlayerId-1';

    it('Case 1 : existingAudience is not null', async () => {
      //Create mock sample
      const existingAudience = new PushAudience();
      existingAudience.userUuid = userUuid;
      existingAudience.playerId = playerId;
      existingAudience.userUuid = 'en';
      existingAudience.deviceType = 1;

      //Mock implement
      jest
        .spyOn(pushService, 'findOnePushAudienceByPlayerId')
        .mockImplementation(() => Promise.resolve(existingAudience));
      //Result Checking
      expect(
        (await pushManager.registerAudiencePlayerId(playerId, userUuid))
          .getData,
      ).toEqual(existingAudience);
    });

    it('Case 2 : oneSignalRsp returns null', async () => {
      //Create mock sample
      const existingAudience = null;
      const oneSignalRsp = null;

      //Mock implement
      jest
        .spyOn(pushService, 'findOnePushAudienceByPlayerId')
        .mockImplementation(() => Promise.resolve(existingAudience));
      jest
        .spyOn(pushService, 'viewDeviceOnOneSignal')
        .mockImplementation(() => Promise.resolve(oneSignalRsp));

      //Result Checking
      try {
        await pushManager.registerAudiencePlayerId(playerId, userUuid);
      } catch (e) {
        expect(e.getResponseStatus).toBe(
          ResponseCode.STATUS_8100_ONE_SIGNAL_ERROR,
        );
      }
    });

    it('Case 3 : oneSignalRsp returns error', async () => {
      //Create mock sample
      const existingAudience = null;
      const oneSignalRsp = {
        errors: ['No user with this id found'],
      };

      //Mock implement
      jest
        .spyOn(pushService, 'findOnePushAudienceByPlayerId')
        .mockImplementation(() => Promise.resolve(existingAudience));
      jest
        .spyOn(pushService, 'viewDeviceOnOneSignal')
        .mockImplementation(() => Promise.resolve(oneSignalRsp));

      //Result Checking
      try {
        await pushManager.registerAudiencePlayerId(playerId, userUuid);
      } catch (e) {
        expect(e.getResponseStatus).toBe(
          ResponseCode.STATUS_8100_ONE_SIGNAL_ERROR,
        );
      }
    });

    it('Case 4 : savePushAudience and return new audience', async () => {
      //Create mock sample
      const existingAudience = null;
      const oneSignalRsp = {
        id: '86c71cee-8fe2-11ec-8774-eea2dbbd9e86',
        identifier:
          'https://fcm.googleapis.com/fcm/send/eJdEU-HYQAg:APA91bGr7r4Eu8zBq5XUfypahRzKLOW5DDvLeGtRqS4gFcXNh59769-uQrnkXaqeEgoDK2zrtxtNqhnFn49-sNpWN38LC2hVS-t9_kW9tVtK78plTZPgmPuTyWMxH72Am1h_DKa8dZ7m',
        session_count: 2,
        language: 'en',
        timezone: 28800,
        game_version: '',
        device_os: '97',
        device_type: 5,
        device_model: 'MacIntel',
        ad_id: null,
        tags: {},
        last_active: 1645096548,
        playtime: 5,
        amount_spent: 0,
        created_at: 1645096362,
        invalid_identifier: true,
        badge_count: 0,
        sdk: '151513',
        test_type: null,
        ip: '61.239.78.185',
        external_user_id: '',
      };
      const newAudience: PushAudience = new PushAudience();
      newAudience.userUuid = userUuid;
      newAudience.playerId = playerId;
      newAudience.language = oneSignalRsp.language;
      newAudience.deviceType = oneSignalRsp.device_type;

      //Mock implement
      jest
        .spyOn(pushService, 'findOnePushAudienceByPlayerId')
        .mockImplementation(() => Promise.resolve(existingAudience));
      jest
        .spyOn(pushService, 'viewDeviceOnOneSignal')
        .mockImplementation(() => Promise.resolve(oneSignalRsp));
      jest
        .spyOn(pushService, 'savePushAudience')
        .mockImplementation(() => Promise.resolve(newAudience));

      //Result Checking
      expect(
        (await pushManager.registerAudiencePlayerId(playerId, userUuid))
          .getData,
      ).toEqual(newAudience);
    });
  });
});

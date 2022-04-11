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

describe('UserController - Unit Test', () => {
  let pushController: PushController;
  let pushManager: PushManager;
  const pushService = {};

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
      controllers: [PushController],
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
    pushController = await moduleRef.resolve(PushController, contextId);
    pushManager = await moduleRef.resolve(PushManager, contextId);
  });

  describe('Endpoint : POST /audience/register', () => {
    it('Case 1 : success 1000', async () => {
      //Create mock sample
      const result = new AppResponse();
      //Mock implement
      jest
        .spyOn(pushManager, 'registerAudiencePlayerId')
        .mockImplementation(() => Promise.resolve(result));
      //Result Checking
      const req = {
        user: {
          uuid: '00000000-0000-0000-0000-000000000000',
        },
      };
      const body = new PushRegisterAudienceReqDto();
      body.playerId = 'testing123';
      expect(
        (await pushController.registerAudiencePlayerId(req, body)).getStatus
          .getCode,
      ).toBe(1000);
    });
  });
});

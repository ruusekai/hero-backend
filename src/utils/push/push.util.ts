import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseCode } from '../../common/response/response.code';
import { ApiException } from '../../common/exception/api.exception';
import { PushMessageDto } from './dto/entity/push-message-dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ViewDeviceRspDto } from './dto/response/view-device-rsp-dto';

@Injectable()
export class PushUtil {
  private readonly endpoint;
  private readonly appKey;

  private readonly logger = new Logger(PushUtil.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.endpoint = this.configService.get<string>(
      'push.ONE_SIGNAL_API_ENDPOINT',
    );
    this.appKey =
      'Basic ' + this.configService.get<string>('push.ONE_SIGNAL_APP_KEY');
  }

  async createNotification(pushMessage: PushMessageDto) {
    try {
      const axiosConfig: any = {
        baseURL: this.endpoint,
        url: '/notifications',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.appKey,
        },
        timeout: 100000,
        method: 'POST',
      };
      axiosConfig.data = pushMessage;
      axiosConfig.params = {};
      const rsp = await lastValueFrom(this.httpService.request(axiosConfig));
      this.logger.log(
        '[PushUtil][createNotification] rsp:' + JSON.stringify(rsp.data),
      );
      return rsp.data;
    } catch (e) {
      this.logger.error(
        '[PushUtil][createNotification] oneSignal error: ' +
          JSON.stringify(e.stack),
      );
      throw new ApiException(ResponseCode.STATUS_8100_ONE_SIGNAL_ERROR, e);
    }
  }

  async viewDevice(playerId: string): Promise<ViewDeviceRspDto> {
    try {
      const axiosConfig: any = {
        baseURL: this.endpoint,
        url: `/players/${playerId}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.appKey,
        },
        timeout: 100000,
        method: 'GET',
      };

      const rsp = await lastValueFrom(this.httpService.request(axiosConfig));
      this.logger.log(
        `[PushUtil][viewDevice] player_id: ${playerId}, rsp: ${JSON.stringify(
          rsp.data,
        )}`,
      );
      return rsp.data;
    } catch (e) {
      this.logger.error(
        '[PushUtil][viewDevice] oneSignal error: ' + JSON.stringify(e.stack),
      );
      throw new ApiException(ResponseCode.STATUS_8100_ONE_SIGNAL_ERROR, e);
    }
  }
}

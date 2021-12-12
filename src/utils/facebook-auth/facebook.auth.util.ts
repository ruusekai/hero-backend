import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { FacebookDebugTokenRspDto } from './dto/response/facebook.debug.token.rsp.dto';
import { FacebookMeRspDto } from './dto/response/facebook.me.rsp.dto';

class AxiosRequestConfig {}

@Injectable()
export class FacebookAuthUtil {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.accessToken =
      this.configService.get<string>('facebook.oauth.CLIENT_ID') +
      '|' +
      this.configService.get<string>('facebook.oauth.CLIENT_SECRET');
  }
  private readonly logger = new Logger(FacebookAuthUtil.name);
  private readonly accessToken;

  async debugToken(inputToken: string): Promise<FacebookDebugTokenRspDto> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        method: 'get',
        url: 'https://graph.facebook.com/debug_token',
        params: { input_token: inputToken, access_token: this.accessToken },
        timeout: 30000,
      };
      const rsp = await lastValueFrom(this.httpService.request(axiosConfig));
      if (rsp.data.data.error != null || rsp.data.data.is_valid === false) {
        this.logger.error(rsp.data.data.error.message);
        throw new ApiException(ResponseCode.STATUS_4015_OAUTH_TOKEN_INVALID);
      }
      return rsp.data.data;
    } catch (e) {
      this.logger.error(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_4015_OAUTH_TOKEN_INVALID);
    }
  }

  async me(inputToken: string): Promise<FacebookMeRspDto> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        method: 'get',
        url: 'https://graph.facebook.com/me',
        params: { access_token: inputToken, fields: 'id,name,email' },
        timeout: 30000,
      };
      const rsp = await lastValueFrom(this.httpService.request(axiosConfig));
      return rsp.data;
    } catch (e) {
      this.logger.error(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_4016_FACEBOOK_API_ERROR);
    }
  }
}

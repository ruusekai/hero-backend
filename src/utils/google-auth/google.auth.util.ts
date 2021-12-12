import { Injectable, Logger } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';

@Injectable()
export class GoogleAuthUtil {
  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('google.oauth.CLIENT_ID');
    this.client = new OAuth2Client(this.clientId);
  }

  private readonly logger = new Logger(GoogleAuthUtil.name);
  private readonly clientId;
  private readonly client;

  async verify(idToken: string): Promise<TokenPayload> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: idToken,
        audience: this.clientId,
        // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (e) {
      this.logger.error(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_4015_OAUTH_TOKEN_INVALID);
    }
  }
}

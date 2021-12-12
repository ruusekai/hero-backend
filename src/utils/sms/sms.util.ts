import { Injectable, Logger } from '@nestjs/common';
import * as Twilio from 'twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsUtil {
  constructor(private readonly configService: ConfigService) {
    const twilioAccountSid = this.configService.get<string>(
      'sms.twilio.ACCOUNT_SID',
    );
    const twilioAuthToken = this.configService.get<string>(
      'sms.twilio.AUTH_TOKEN',
    );
    // const twilioApiKey = this.configService.get<string>('sms.twilio.API_KEY');
    // const twilioApiSecret = this.configService.get<string>(
    //   'sms.twilio.API_SECRET',
    // );

    this.client = Twilio(twilioAccountSid, twilioAuthToken);
    this.twilioMessagingServiceSid = this.configService.get<string>(
      'sms.twilio.MESSAGING_SERVICE_SID',
    );
  }
  private readonly logger = new Logger(SmsUtil.name);
  private readonly client;
  private readonly twilioMessagingServiceSid;

  async sendSms(token: string) {
    const message = await this.client.messages.create({
      body: 'testing, your verification code is: ' + token,
      messagingServiceSid: this.twilioMessagingServiceSid,
      to: '+85294271798',
    });
    this.logger.log(message.sid);
  }
}

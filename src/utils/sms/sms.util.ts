import { Logger } from '@nestjs/common';
import * as twilio from 'twilio';

export class SmsUtil {
  private readonly logger = new Logger(SmsUtil.name);

  private readonly accountSid = 'ACeced4ada248db2704feed4a9596b3e10';
  private readonly authToken = '2a60ae4331d40e57825d76be9a3c7efe';
  private readonly client = twilio(this.accountSid, this.authToken);

  async sendSms(token: string) {
    const message = await this.client.messages.create({
      body: 'testing, your verification code is: ' + token,
      messagingServiceSid: 'MG4e9a4fe72b04b916e9b796d0ca73fb00',
      to: '+85294271798',
    });
    this.logger.log(message.sid);
  }
}

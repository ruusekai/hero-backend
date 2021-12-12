import { Module } from '@nestjs/common';
import { SmsUtil } from './sms.util';

@Module({
  imports: [],
  providers: [SmsUtil],
  exports: [SmsUtil],
})
export class SmsUtilModule {}

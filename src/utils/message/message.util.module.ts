import { Module } from '@nestjs/common';
import { MessageUtil } from './message.util';

@Module({
  imports: [],
  providers: [MessageUtil],
  exports: [MessageUtil],
})
export class MessageUtilModule {}

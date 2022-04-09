import { Module } from '@nestjs/common';
import { MessageWebTestService } from './message-web-test.service';
import { MessageWebTestController } from './message-web-test.controller';

@Module({
  controllers: [MessageWebTestController],
  providers: [MessageWebTestService],
})
export class MessageWebTestModule {}

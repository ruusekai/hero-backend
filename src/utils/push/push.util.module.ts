import { Module } from '@nestjs/common';
import { PushUtil } from './push.util';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PushUtil],
  exports: [PushUtil],
})
export class PushUtilModule {}

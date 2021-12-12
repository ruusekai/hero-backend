import { Module } from '@nestjs/common';
import { FacebookAuthUtil } from './facebook.auth.util';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [FacebookAuthUtil],
  exports: [FacebookAuthUtil],
})
export class FacebookAuthUtilModule {}

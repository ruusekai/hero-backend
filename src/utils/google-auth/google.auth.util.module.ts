import { Module } from '@nestjs/common';
import { GoogleAuthUtil } from './google.auth.util';

@Module({
  imports: [],
  providers: [GoogleAuthUtil],
  exports: [GoogleAuthUtil],
})
export class GoogleAuthUtilModule {}

import { Module } from '@nestjs/common';
import { CryptoUtil } from './crypto.util';

@Module({
  imports: [],
  providers: [CryptoUtil],
  exports: [CryptoUtil],
})
export class CryptoUtilModule {}

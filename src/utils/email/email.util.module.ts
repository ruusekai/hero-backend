import { Module } from '@nestjs/common';
import { EmailUtil } from './email.util';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [EmailUtil],
  exports: [EmailUtil],
})
export class EmailUtilModule {}

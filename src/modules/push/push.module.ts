import { Module } from '@nestjs/common';
import { PushManager } from './push.manager';
import { PushService } from './push.service';
import { PushController } from './push.controller';
import { PushUtilModule } from '../../utils/push/push.util.module';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';

@Module({
  imports: [PushUtilModule, MySqlRepositoryModule],
  controllers: [PushController],
  providers: [PushManager, PushService],
  exports: [PushService],
})
export class PushModule {}

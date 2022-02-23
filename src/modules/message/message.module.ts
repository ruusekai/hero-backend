import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageUtilModule } from '../../utils/message/message.util.module';
import { MessageManager } from './message.manager';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';
import { PushModule } from '../push/push.module';

@Module({
  imports: [MessageUtilModule, MySqlRepositoryModule, PushModule],
  controllers: [MessageController],
  providers: [MessageManager, MessageService],
  exports: [MessageService],
})
export class MessageModule {}

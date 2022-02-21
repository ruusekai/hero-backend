import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageUtilModule } from '../../utils/message/message.util.module';
import { MessageManager } from './message.manager';
import { TaskModule } from '../task/task.module';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';

@Module({
  imports: [MessageUtilModule, MySqlRepositoryModule],
  controllers: [MessageController],
  providers: [MessageManager, MessageService],
  exports: [MessageService],
})
export class MessageModule {}

import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MessageModule } from '../message/message.module';
import { AdminManager } from './admin.manager';

@Module({
  imports: [MessageModule],
  controllers: [AdminController],
  providers: [AdminManager, AdminService],
})
export class AdminModule {}

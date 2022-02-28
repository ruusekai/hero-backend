import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ReportManager } from './report.manager';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';
import { TaskModule } from '../task/task.module';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [MySqlRepositoryModule, TaskModule, ReviewModule],
  controllers: [ReportController],
  providers: [ReportManager, ReportService],
})
export class ReportModule {}

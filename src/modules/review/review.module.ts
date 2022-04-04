import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewManager } from './review.manager';
import { TaskMatchingAttemptModule } from '../task-matching-attempt/task-matching-attempt.module';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';

@Module({
  imports: [MySqlRepositoryModule, TaskMatchingAttemptModule],
  controllers: [ReviewController],
  providers: [ReviewManager, ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}

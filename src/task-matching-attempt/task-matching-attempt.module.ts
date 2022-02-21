import { Module } from '@nestjs/common';
import { TaskMatchingAttemptService } from './task-matching-attempt.service';
import { TaskMatchingAttemptController } from './task-matching-attempt.controller';

@Module({
  controllers: [TaskMatchingAttemptController],
  providers: [TaskMatchingAttemptService]
})
export class TaskMatchingAttemptModule {}

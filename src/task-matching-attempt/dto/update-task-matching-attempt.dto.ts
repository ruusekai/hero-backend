import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskMatchingAttemptDto } from './create-task-matching-attempt.dto';

export class UpdateTaskMatchingAttemptDto extends PartialType(CreateTaskMatchingAttemptDto) {}

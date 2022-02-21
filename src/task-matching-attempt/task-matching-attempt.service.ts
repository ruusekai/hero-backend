import { Injectable } from '@nestjs/common';
import { CreateTaskMatchingAttemptDto } from './dto/create-task-matching-attempt.dto';
import { UpdateTaskMatchingAttemptDto } from './dto/update-task-matching-attempt.dto';

@Injectable()
export class TaskMatchingAttemptService {
  create(createTaskMatchingAttemptDto: CreateTaskMatchingAttemptDto) {
    return 'This action adds a new taskMatchingAttempt';
  }

  findAll() {
    return `This action returns all taskMatchingAttempt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskMatchingAttempt`;
  }

  update(id: number, updateTaskMatchingAttemptDto: UpdateTaskMatchingAttemptDto) {
    return `This action updates a #${id} taskMatchingAttempt`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskMatchingAttempt`;
  }
}

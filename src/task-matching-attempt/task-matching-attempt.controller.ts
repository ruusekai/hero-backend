import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskMatchingAttemptService } from './task-matching-attempt.service';
import { CreateTaskMatchingAttemptDto } from './dto/create-task-matching-attempt.dto';
import { UpdateTaskMatchingAttemptDto } from './dto/update-task-matching-attempt.dto';

@Controller('task-matching-attempt')
export class TaskMatchingAttemptController {
  constructor(private readonly taskMatchingAttemptService: TaskMatchingAttemptService) {}

  @Post()
  create(@Body() createTaskMatchingAttemptDto: CreateTaskMatchingAttemptDto) {
    return this.taskMatchingAttemptService.create(createTaskMatchingAttemptDto);
  }

  @Get()
  findAll() {
    return this.taskMatchingAttemptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskMatchingAttemptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskMatchingAttemptDto: UpdateTaskMatchingAttemptDto) {
    return this.taskMatchingAttemptService.update(+id, updateTaskMatchingAttemptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskMatchingAttemptService.remove(+id);
  }
}

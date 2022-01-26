import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { UpdateTaskDto } from './dto/request/update.task.dto';
import { CreateTaskDto } from './dto/request/create.task.dto';
import { TaskManager } from './task.manager';
import { TaskService } from './task.service';
import { FindTaskReqDto } from './dto/request/find.task.req.dto';
import { TaskRepository } from '../../database/mysql/repositories/task.repository';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskManager: TaskManager,
    private readonly taskService: TaskService,
    private readonly taskRepository: TaskRepository,
  ) {}

  @Post()
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.taskManager.create(req.user.uuid, createTaskDto);
  }

  @Get()
  findAll(@Query() findTaskReqDto: FindTaskReqDto) {
    return this.taskManager.findAllWithQueryOptions(findTaskReqDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }
}

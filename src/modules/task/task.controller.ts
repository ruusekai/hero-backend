import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/request/create.task.dto';
import { TaskManager } from './task.manager';
import { FindTaskReqDto } from './dto/request/find.task.req.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskManager: TaskManager) {}

  @Post()
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.taskManager.create(req.user.uuid, createTaskDto);
  }

  @Get()
  findAll(@Query() findTaskReqDto: FindTaskReqDto) {
    return this.taskManager.findAllWithQueryOptions(findTaskReqDto);
  }

  @Delete(':taskUuid')
  cancelTaskByBoss(@Request() req, @Param('taskUuid') taskUuid: string) {
    return this.taskManager.cancelTaskByBoss(req.user.uuid, taskUuid);
  }

  @Get('/hero')
  listUserHeroTask(@Request() req) {
    return this.taskManager.listUserHeroTask(req.user.uuid);
  }

  @Get('/boss')
  listUserBossTask(@Request() req) {
    return this.taskManager.listUserBossTask(req.user.uuid);
  }
}

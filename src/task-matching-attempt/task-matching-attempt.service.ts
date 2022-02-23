import { Injectable } from '@nestjs/common';
import { TaskMatchingAttempt } from '../database/mysql/entities/task.matching.attempt.entity';
import { TaskMatchingAttemptRepository } from '../database/mysql/repositories/task.matching.attempt.repository';
import { ApiException } from '../common/exception/api.exception';
import { ResponseCode } from '../common/response/response.code';
import { TaskMatchingAttemptStatus } from '../modules/task/enum/matching-attempt-status';
import { MessageService } from '../modules/message/message.service';
import { TaskRepository } from '../database/mysql/repositories/task.repository';
import { Task } from '../database/mysql/entities/task.entity';
import { TaskPostStatus } from '../modules/task/enum/task-post-status';
import { MessageUserRoleType } from '../modules/message/enum/message-user-role-type';
import { MatchingHistoryActionType } from '../modules/task/enum/matching-history-action-type';
import { TaskHistoryRepository } from '../database/mysql/repositories/task.history.repository';
import { TaskHistory } from '../database/mysql/entities/task.history.entity';

@Injectable()
export class TaskMatchingAttemptService {
  constructor(
    private readonly taskMatchingAttemptRepository: TaskMatchingAttemptRepository,
    private readonly taskHistoryRepository: TaskHistoryRepository,
    private readonly messageService: MessageService,
    private readonly taskRepository: TaskRepository,
  ) {}

  async findOneMatchingAttemptWithUserUuidChecking(
    messageGroupId: string,
    userUuid: string,
  ) {
    const matchingAttempt: TaskMatchingAttempt =
      await this.findOneTaskMatchingAttemptByMessageGroupId(messageGroupId);
    if (matchingAttempt == null) {
      throw new ApiException(ResponseCode.STATUS_8001_MESSAGE_GROUP_NOT_EXIST);
    } else if (
      matchingAttempt.bossUserUuid !== userUuid &&
      matchingAttempt.heroUserUuid !== userUuid
    ) {
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    }
    return matchingAttempt;
  }

  async findOneTaskMatchingAttemptByMessageGroupId(messageGroupId: string) {
    return await this.taskMatchingAttemptRepository.findOneTaskMatchingAttemptByMessageGroupId(
      messageGroupId,
    );
  }

  async findTaskMatchingAttemptListByTaskUuid(taskUuid: string) {
    return await this.taskMatchingAttemptRepository.findTaskMatchingAttemptByTaskUuid(
      taskUuid,
    );
  }

  async findTaskMatchingAttemptByTaskUuidAndNotMessageGroupId(
    taskUUid: string,
    messageGroupId: string,
  ) {
    return await this.taskMatchingAttemptRepository.findTaskMatchingAttemptByTaskUuidAndNotMessageGroupId(
      taskUUid,
      messageGroupId,
    );
  }

  async saveTaskMatchingAttempt(entity: TaskMatchingAttempt) {
    return await this.taskMatchingAttemptRepository.saveOneTaskMatchingAttempt(
      entity,
    );
  }

  async saveTaskMatchingAttemptByList(entityList: TaskMatchingAttempt[]) {
    return await this.taskMatchingAttemptRepository.saveTaskMatchingAttemptByList(
      entityList,
    );
  }

  async saveTaskHistory(entity: TaskHistory) {
    return await this.taskHistoryRepository.saveTaskHistory(entity);
  }

  async disableMatchingAttemptAndCloseMessageGroupAndCreateHistoryByList(
    entityList: TaskMatchingAttempt[],
    status: TaskMatchingAttemptStatus,
    userRole: MessageUserRoleType,
  ) {
    entityList = await Promise.all(
      entityList.map(async (entity) => {
        //1. disable chatroom
        await this.messageService.disableMessageGroupById(
          entity.messageGroupId,
        );
        //2. create history
        const histroy: TaskHistory = new TaskHistory(
          entity.taskUuid,
          entity.messageGroupId,
          userRole === MessageUserRoleType.HERO
            ? entity.heroUserUuid
            : entity.bossUserUuid,
          userRole,
          MatchingHistoryActionType.STATUS_CHANGE,
          entity.status,
          status,
        );
        await this.saveTaskHistory(histroy);
        //3. save matchingAttempt
        entity.isMatched = false;
        entity.isMessageGroupActive = false;
        entity.status = status;
        return entity;
      }),
    );
    await this.saveTaskMatchingAttemptByList(entityList);
    return true;
  }

  async disableMatchingAttemptAndCloseMessageGroupAndCreateHistory(
    entity: TaskMatchingAttempt,
    status: TaskMatchingAttemptStatus,
    userRole: MessageUserRoleType,
  ) {
    //1. disable chatroom
    await this.messageService.disableMessageGroupById(entity.messageGroupId);
    //2. create history
    const histroy: TaskHistory = new TaskHistory(
      entity.taskUuid,
      entity.messageGroupId,
      userRole === MessageUserRoleType.HERO
        ? entity.heroUserUuid
        : entity.bossUserUuid,
      userRole,
      MatchingHistoryActionType.STATUS_CHANGE,
      entity.status,
      status,
    );
    await this.saveTaskHistory(histroy);
    //3. update matching attempt
    entity.isMatched = false;
    entity.isMessageGroupActive = false;
    entity.status = status;
    return entity;
    await this.saveTaskMatchingAttempt(entity);
    return true;
  }

  async updateMatchedTaskAndStopPosting(
    task: Task,
    matchingAttempt: TaskMatchingAttempt,
  ): Promise<Task> {
    task.postStatus = TaskPostStatus.MATCHED;
    task.heroUserUuid = matchingAttempt.heroUserUuid;
    task.messageGroupId = matchingAttempt.messageGroupId;
    task = await this.taskRepository.saveTask(task);
    return task;
  }

  async updateTaskAndRestartPostingDueToHeroCancel(
    matchingAttempt: TaskMatchingAttempt,
  ) {
    let task: Task =
      await this.taskRepository.findOneTaskByUuidAndIsDeletedFalse(
        matchingAttempt.taskUuid,
      );
    if (task == null) {
      throw new ApiException(ResponseCode.STATUS_7010_TASK_NOT_EXIST);
    }
    task.postStatus = TaskPostStatus.AVAILABLE;
    task.heroUserUuid = null;
    task.messageGroupId = null;
    task = await this.taskRepository.saveTask(task);
    return task;
  }
}

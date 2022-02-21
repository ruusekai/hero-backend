import { Injectable } from '@nestjs/common';
import { MessageService } from './message.service';
import { Task } from '../../database/mysql/entities/task.entity';
import { TaskService } from '../task/task.service';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { CreateMessageGroupRspDto } from './dto/response/create-message-group-rsp-dto';
import { AppResponse } from '../../common/response/app.response';
import { FirebaseGroupDto } from './dto/entity/firebase-group-dto';
import { MessageUserRoleType } from './enum/message-user-role-type';
import { MessageType } from './enum/message-type';
import { CreateMessageRspDto } from './dto/response/create-message-rsp-dto';
import { CreateCustomTokenRspDto } from './dto/response/create-custom-token-rsp-dto';
import { TaskMatchingAttemptStatus } from '../task/enum/matching-attempt-status';
import { TaskRepository } from '../../database/mysql/repositories/task.repository';
import { TaskMatchingAttemptRepository } from '../../database/mysql/repositories/task.matching.attempt.repository';
import { TaskMatchingAttempt } from '../../database/mysql/entities/task.matching.attempt.entity';

@Injectable()
export class MessageManager {
  constructor(
    private readonly messageService: MessageService,
    private readonly taskRepository: TaskRepository,
    private readonly taskMatchingAttemptRepository: TaskMatchingAttemptRepository,
  ) {}
  async createCustomToken(userUuid: string): Promise<AppResponse> {
    const customToken: string = await this.messageService.createCustomToken(
      userUuid,
    );
    return new AppResponse(new CreateCustomTokenRspDto(customToken));
  }

  async createMessageGroup(
    taskUuid: string,
    heroUuid: string,
  ): Promise<AppResponse> {
    const task: Task =
      await this.taskRepository.findOneTaskByUuidAndIsDeletedFalse(taskUuid);
    if (task == null) {
      throw new ApiException(ResponseCode.STATUS_7010_TASK_NOT_EXIST);
    }
    if (heroUuid === task.bossUserUuid) {
      throw new ApiException(ResponseCode.STATUS_9999_SYSTEM_ERROR);
    }

    const bossRandomName: string =
      'boss-' + (await this.messageService.getRandomNumberWithFourDigits());
    const heroRandomName: string =
      'hero-' + (await this.messageService.getRandomNumberWithFourDigits());

    const newMessageGroupKey = await this.messageService.createMessageGroup(
      taskUuid,
      heroUuid,
      task.bossUserUuid,
      bossRandomName,
      heroRandomName,
    );

    //create new task matching attempt with status = CREATED_MESSAGE_GROUP
    const matchingAttempt: TaskMatchingAttempt = new TaskMatchingAttempt(
      newMessageGroupKey,
      taskUuid,
      heroUuid,
      heroRandomName,
      task.bossUserUuid,
      bossRandomName,
      false,
      TaskMatchingAttemptStatus.CREATED_MESSAGE_GROUP,
      true,
    );
    await this.taskMatchingAttemptRepository.saveOneTaskMatchingAttempt(
      matchingAttempt,
    );
    return new AppResponse(new CreateMessageGroupRspDto(newMessageGroupKey));
  }

  async createMessage(
    messageGroupId: string,
    userUuid: string,
    messageType: MessageType,
    content: string,
  ): Promise<AppResponse> {
    //check if the messageGroupId exists
    const group: FirebaseGroupDto =
      await this.messageService.findMessageGroupById(messageGroupId);
    if (group == null) {
      throw new ApiException(ResponseCode.STATUS_8001_MESSAGE_GROUP_NOT_EXIST);
    } else if (group.active !== true) {
      throw new ApiException(ResponseCode.STATUS_8002_MESSAGE_GROUP_NOT_ACTIVE);
    }

    //check the user role in this group
    let userRole: MessageUserRoleType = null;
    let userName: string;
    if (group.boss.id === userUuid) {
      userRole = group.boss.role;
      userName = group.boss.name;
    } else if (group.hero.id === userUuid) {
      userRole = group.hero.role;
      userName = group.hero.name;
    }
    if (userRole == null) {
      throw new ApiException(
        ResponseCode.STATUS_8003_USER_NOT_IN_MESSAGE_GROUP,
      );
    }
    await this.messageService.validateMessageContent(messageType, content);
    const rsp: CreateMessageRspDto = await this.messageService.createMessage(
      messageGroupId,
      userUuid,
      messageType,
      content,
      userRole,
      userName,
    );
    return new AppResponse(rsp);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { MessageService } from './message.service';
import { Task } from '../../database/mysql/entities/task.entity';
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
import { AdminApprovalStatus } from '../../common/enum/admin.approval.status';
import { TaskPaymentStatus } from '../task/enum/task.payment.status';
import { PushTemplateName } from '../../common/enum/push.template.name';
import { PushService } from '../push/push.service';

@Injectable()
export class MessageManager {
  private readonly logger = new Logger(MessageManager.name);

  constructor(
    private readonly messageService: MessageService,
    private readonly taskRepository: TaskRepository,
    private readonly taskMatchingAttemptRepository: TaskMatchingAttemptRepository,
    private readonly pushService: PushService,
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
    } else if (heroUuid === task.bossUserUuid) {
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (task.adminStatus !== AdminApprovalStatus.APPROVED) {
      throw new ApiException(
        ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
      );
    } else if (
      !(
        task.paymentStatus === TaskPaymentStatus.REQUIRES_CAPTURE ||
        task.paymentStatus === TaskPaymentStatus.SUCCEEDED
      )
    ) {
      throw new ApiException(
        ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
      );
    } else if (task.heroUserUuid != null) {
      throw new ApiException(ResponseCode.STATUS_7013_TASK_ALREADY_MATCHED);
    }

    const bossRandomName: string =
      'boss-' + (await this.messageService.getRandomNumberWithFourDigits());
    const heroRandomName: string =
      'hero-' + (await this.messageService.getRandomNumberWithFourDigits());

    const newMessageGroupKey = await this.messageService.createMessageGroup(
      taskUuid,
      task.title,
      heroUuid,
      task.bossUserUuid,
      bossRandomName,
      heroRandomName,
    );

    const rsp = new CreateMessageGroupRspDto(newMessageGroupKey);

    //check if the group already exists, if so, dont do the rest
    const existingMatchingAttempt: TaskMatchingAttempt =
      await this.taskMatchingAttemptRepository.findOneTaskMatchingAttemptByMessageGroupId(
        newMessageGroupKey,
      );

    if (existingMatchingAttempt != null) {
      this.logger.log(`existing message group, skip creating attempt`);
      return new AppResponse(rsp);
    }

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
    return new AppResponse(rsp);
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
    let recipientUserUuid: string;
    let templateName: PushTemplateName;
    let userRole: MessageUserRoleType = null;
    let userName: string;
    if (group.boss.id === userUuid) {
      userRole = group.boss.role;
      userName = group.boss.name;
      recipientUserUuid = group.hero.id;
      templateName = PushTemplateName.NEW_MESSAGE_FROM_BOSS;
    } else if (group.hero.id === userUuid) {
      userRole = group.hero.role;
      userName = group.hero.name;
      recipientUserUuid = group.boss.id;
      templateName = PushTemplateName.NEW_MESSAGE_FROM_HERO;
    }
    if (userRole == null) {
      throw new ApiException(
        ResponseCode.STATUS_8003_USER_NOT_IN_MESSAGE_GROUP,
      );
    }
    //send message
    await this.messageService.validateMessageContent(messageType, content);
    const rsp: CreateMessageRspDto = await this.messageService.createMessage(
      messageGroupId,
      userUuid,
      messageType,
      content,
      userRole,
      userName,
    );

    //send notification(no await)
    this.pushService.createNotificationByTemplate(
      recipientUserUuid,
      templateName,
      messageGroupId,
      messageType === MessageType.IMAGE ? '<圖片>' : content,
    );

    return new AppResponse(rsp);
  }
}

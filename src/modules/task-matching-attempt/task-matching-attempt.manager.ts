import { Injectable, Logger } from '@nestjs/common';
import { AppResponse } from '../../common/response/app.response';
import { TaskMatchingAttemptService } from './task-matching-attempt.service';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { TaskMatchingAttempt } from '../../database/mysql/entities/task.matching.attempt.entity';
import { MatchingAttemptAction } from '../../common/enum/matching.attempt.action';
import { TaskMatchingAttemptStatus } from '../task/enum/matching-attempt-status';
import { MessageUserRoleType } from '../message/enum/message-user-role-type';
import { MatchingHistoryActionType } from '../task/enum/matching-history-action-type';
import { TaskMatchingAttemptRspDto } from './dto/entity/task-matching-attempt-rsp-dto';
import { PushService } from '../push/push.service';
import { PushTemplateName } from '../../common/enum/push.template.name';
import { PaymentService } from '../payment/payment.service';
import { Task } from '../../database/mysql/entities/task.entity';
import { TaskHistory } from '../../database/mysql/entities/task.history.entity';
import { WalletService } from '../wallet/wallet.service';
import { TaskRepository } from '../../database/mysql/repositories/task.repository';

@Injectable()
export class TaskMatchingAttemptManager {
  private readonly logger = new Logger(TaskMatchingAttemptManager.name);

  constructor(
    private readonly matchingAttemptService: TaskMatchingAttemptService,
    private readonly pushService: PushService,
    private readonly paymentService: PaymentService,
    private readonly walletService: WalletService,
    private readonly taskRepo: TaskRepository,
  ) {}

  async findOne(
    messageGroupId: string,
    userUuid: string,
  ): Promise<AppResponse> {
    const matchingAttempt: TaskMatchingAttempt =
      await this.matchingAttemptService.findOneMatchingAttemptWithUserUuidChecking(
        messageGroupId,
        userUuid,
      );
    const rsp = new TaskMatchingAttemptRspDto(matchingAttempt);

    return new AppResponse(rsp);
  }

  async update(
    messageGroupId: string,
    action: MatchingAttemptAction,
    userUuid: string,
  ) {
    const matchingAttempt: TaskMatchingAttempt =
      await this.matchingAttemptService.findOneMatchingAttemptWithUserUuidChecking(
        messageGroupId,
        userUuid,
      );
    switch (action) {
      case MatchingAttemptAction.HERO_CANCEL_MESSAGE_GROUP:
        return await this.heroCancelMessageGroup(matchingAttempt, userUuid);
      case MatchingAttemptAction.HERO_SEND_MATCHING:
        return await this.heroSendMatching(matchingAttempt, userUuid);
      case MatchingAttemptAction.BOSS_REJECT_MATCHING:
        return await this.bossRejectMatching(matchingAttempt, userUuid);
      case MatchingAttemptAction.BOSS_ACCEPT_MATCHING:
        return await this.bossAcceptMatching(matchingAttempt, userUuid);
      case MatchingAttemptAction.HERO_CANCEL_MATCHING:
        return await this.heroCancelMatching(matchingAttempt, userUuid);
      case MatchingAttemptAction.HERO_DONE_TASK:
        return await this.heroDoneTask(matchingAttempt, userUuid);
      case MatchingAttemptAction.BOSS_ACCEPT_DONE:
        return await this.bossAcceptDone(matchingAttempt, userUuid);
      case MatchingAttemptAction.BOSS_REJECT_DONE:
        return await this.bossRejectDone(matchingAttempt, userUuid);
      default:
        throw new ApiException(
          ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
        );
    }
  }

  async heroSendMatching(
    matchingAttempt: TaskMatchingAttempt,
    userUuid: string,
  ): Promise<AppResponse> {
    const currentMatchingStatus: TaskMatchingAttemptStatus =
      matchingAttempt.status;
    const newMatchingStatus: TaskMatchingAttemptStatus =
      TaskMatchingAttemptStatus.HERO_SEND_MATCHING;

    //1.checking
    //only hero can do
    if (userUuid !== matchingAttempt.heroUserUuid) {
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (
      //only not matched task can do
      matchingAttempt.status !== TaskMatchingAttemptStatus.CREATED_MESSAGE_GROUP
    ) {
      this.logger.error(`invalid attempt status: ${matchingAttempt.status}`);
      throw new ApiException(
        ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
      );
    } else if (matchingAttempt.task.heroUserUuid != null) {
      this.logger.error(`task already matched`);
      throw new ApiException(
        ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
      );
    }
    this.logger.log(
      `[bossRejectDone] matchingAttemptId: ${matchingAttempt.messageGroupId}, currentMatchingStatus: ${currentMatchingStatus}, newMatchingStatus: ${newMatchingStatus}`,
    );

    //2. save the attempt
    matchingAttempt.status = newMatchingStatus;
    matchingAttempt = await this.matchingAttemptService.saveTaskMatchingAttempt(
      matchingAttempt,
    );

    //3. send notification to boss
    //without await
    this.pushService.createNotificationByTemplate(
      matchingAttempt.bossUserUuid,
      PushTemplateName.HERO_SEND_MATCHING,
      matchingAttempt.messageGroupId,
    );

    //4. save attempt history
    const historyEntity: TaskHistory = new TaskHistory(
      matchingAttempt.taskUuid,
      matchingAttempt.messageGroupId,
      matchingAttempt.heroUserUuid,
      MessageUserRoleType.HERO,
      MatchingHistoryActionType.STATUS_CHANGE,
      currentMatchingStatus,
      newMatchingStatus,
    );
    await this.matchingAttemptService.saveTaskHistory(historyEntity);

    const rsp = new TaskMatchingAttemptRspDto(matchingAttempt);
    return new AppResponse(rsp);
  }

  async bossRejectMatching(
    matchingAttempt: TaskMatchingAttempt,
    userUuid: string,
  ): Promise<AppResponse> {
    const currentMatchingStatus: TaskMatchingAttemptStatus =
      matchingAttempt.status;
    const newMatchingStatus: TaskMatchingAttemptStatus =
      TaskMatchingAttemptStatus.BOSS_REJECT_MATCHING;

    //1. checking
    //only boss can do
    if (userUuid !== matchingAttempt.bossUserUuid) {
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (
      //only not matched task can do
      matchingAttempt.status !== TaskMatchingAttemptStatus.HERO_SEND_MATCHING
    ) {
      this.logger.error(`invalid attempt status: ${matchingAttempt.status}`);
      throw new ApiException(
        ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
      );
    }
    this.logger.log(
      `[bossRejectDone] matchingAttemptId: ${matchingAttempt.messageGroupId}, currentMatchingStatus: ${currentMatchingStatus}, newMatchingStatus: ${newMatchingStatus}`,
    );

    //2. save the attempt and close chatroom
    await this.matchingAttemptService.disableMatchingAttemptAndCloseMessageGroupAndCreateHistory(
      matchingAttempt,
      newMatchingStatus,
      MessageUserRoleType.BOSS,
    );

    //3. send notification to hero
    this.pushService.createNotificationByTemplate(
      matchingAttempt.heroUserUuid,
      PushTemplateName.BOSS_REJECT_MATCHING,
      matchingAttempt.messageGroupId,
    );

    //4. save attempt history
    const historyEntity: TaskHistory = new TaskHistory(
      matchingAttempt.taskUuid,
      matchingAttempt.messageGroupId,
      matchingAttempt.bossUserUuid,
      MessageUserRoleType.BOSS,
      MatchingHistoryActionType.STATUS_CHANGE,
      currentMatchingStatus,
      newMatchingStatus,
    );
    await this.matchingAttemptService.saveTaskHistory(historyEntity);

    const rsp = new TaskMatchingAttemptRspDto(matchingAttempt);
    return new AppResponse(rsp);
  }

  async bossAcceptMatching(
    matchingAttempt: TaskMatchingAttempt,
    userUuid: string,
  ): Promise<AppResponse> {
    const currentMatchingStatus: TaskMatchingAttemptStatus =
      matchingAttempt.status;
    const newMatchingStatus: TaskMatchingAttemptStatus =
      TaskMatchingAttemptStatus.BOSS_ACCEPT_MATCHING;

    //1.checking
    //only boss can do
    if (userUuid !== matchingAttempt.bossUserUuid) {
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (
      //only not matched task can do
      matchingAttempt.status !== TaskMatchingAttemptStatus.HERO_SEND_MATCHING
    ) {
      this.logger.error(`invalid attempt status: ${matchingAttempt.status}`);
      throw new ApiException(
        ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
      );
    }
    this.logger.log(
      `[bossRejectDone] matchingAttemptId: ${matchingAttempt.messageGroupId}, currentMatchingStatus: ${currentMatchingStatus}, newMatchingStatus: ${newMatchingStatus}`,
    );

    //2. capture payment
    let taskEntity: Task =
      await this.taskRepo.findOneTaskByUuidAndIsDeletedFalse(
        matchingAttempt.taskUuid,
      );
    if (taskEntity == null) {
      throw new ApiException(ResponseCode.STATUS_7010_TASK_NOT_EXIST);
    }
    await this.paymentService.captureFullPaymentOfMatchedTask(taskEntity);

    //3.save the attempt and task
    matchingAttempt.status = newMatchingStatus;
    matchingAttempt.isMatched = true;
    matchingAttempt = await this.matchingAttemptService.saveTaskMatchingAttempt(
      matchingAttempt,
    );
    //save the task
    taskEntity =
      await this.matchingAttemptService.updateMatchedTaskAndStopPosting(
        taskEntity,
        matchingAttempt,
      );

    //4. close all other chatrooms
    const otherMatchingAttemptList: TaskMatchingAttempt[] =
      await this.matchingAttemptService.findTaskMatchingAttemptByTaskUuidAndNotMessageGroupId(
        matchingAttempt.taskUuid,
        matchingAttempt.messageGroupId,
      );
    await this.matchingAttemptService.disableMatchingAttemptAndCloseMessageGroupAndCreateHistoryByList(
      otherMatchingAttemptList,
      TaskMatchingAttemptStatus.BOSS_MATCHED_WITH_OTHERS,
      MessageUserRoleType.BOSS,
    );

    //TODO:5a send noti when boss match others??
    //5b. send notification to hero for a successful match
    //without await
    this.pushService.createNotificationByTemplate(
      matchingAttempt.heroUserUuid,
      PushTemplateName.BOSS_ACCEPT_MATCHING,
      matchingAttempt.messageGroupId,
    );

    //6. save attempt history
    const historyEntity: TaskHistory = new TaskHistory(
      matchingAttempt.taskUuid,
      matchingAttempt.messageGroupId,
      matchingAttempt.bossUserUuid,
      MessageUserRoleType.BOSS,
      MatchingHistoryActionType.STATUS_CHANGE,
      currentMatchingStatus,
      newMatchingStatus,
    );
    await this.matchingAttemptService.saveTaskHistory(historyEntity);

    const rsp = new TaskMatchingAttemptRspDto(matchingAttempt);
    return new AppResponse(rsp);
  }

  async heroCancelMatching(
    matchingAttempt: TaskMatchingAttempt,
    userUuid: string,
  ): Promise<AppResponse> {
    const currentMatchingStatus: TaskMatchingAttemptStatus =
      matchingAttempt.status;
    const newMatchingStatus: TaskMatchingAttemptStatus =
      TaskMatchingAttemptStatus.HERO_CANCEL_MATCHING;

    //1.checking
    //only hero can do
    if (userUuid !== matchingAttempt.heroUserUuid) {
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (
      //only matched task can do
      matchingAttempt.status !== TaskMatchingAttemptStatus.BOSS_ACCEPT_MATCHING
    ) {
      this.logger.error(`invalid attempt status: ${matchingAttempt.status}`);
      throw new ApiException(
        ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
      );
    }
    this.logger.log(
      `[bossRejectDone] matchingAttemptId: ${matchingAttempt.messageGroupId}, currentMatchingStatus: ${currentMatchingStatus}, newMatchingStatus: ${newMatchingStatus}`,
    );

    //2. save the attempt and close chatroom
    await this.matchingAttemptService.disableMatchingAttemptAndCloseMessageGroupAndCreateHistory(
      matchingAttempt,
      newMatchingStatus,
      MessageUserRoleType.HERO,
    );

    //3. save the task and restart posting (not repost)
    await this.matchingAttemptService.updateTaskAndRestartPostingDueToHeroCancel(
      matchingAttempt,
    );

    //4. send notification to boss
    this.pushService.createNotificationByTemplate(
      matchingAttempt.bossUserUuid,
      PushTemplateName.HERO_CANCEL_MATCHING,
      matchingAttempt.messageGroupId,
    );

    //5. save attempt history
    const historyEntity: TaskHistory = new TaskHistory(
      matchingAttempt.taskUuid,
      matchingAttempt.messageGroupId,
      matchingAttempt.heroUserUuid,
      MessageUserRoleType.HERO,
      MatchingHistoryActionType.STATUS_CHANGE,
      currentMatchingStatus,
      newMatchingStatus,
    );
    await this.matchingAttemptService.saveTaskHistory(historyEntity);

    const rsp = new TaskMatchingAttemptRspDto(matchingAttempt);
    return new AppResponse(rsp);
  }

  async heroDoneTask(matchingAttempt: TaskMatchingAttempt, userUuid: string) {
    const currentMatchingStatus: TaskMatchingAttemptStatus =
      matchingAttempt.status;
    const newMatchingStatus: TaskMatchingAttemptStatus =
      TaskMatchingAttemptStatus.HERO_DONE_TASK;

    //1.checking
    //only hero can do
    if (userUuid !== matchingAttempt.heroUserUuid) {
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (
      //only matched task can do
      matchingAttempt.status !== TaskMatchingAttemptStatus.BOSS_ACCEPT_MATCHING
    ) {
      this.logger.error(`invalid attempt status: ${matchingAttempt.status}`);
      throw new ApiException(
        ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
      );
    }
    this.logger.log(
      `[bossRejectDone] matchingAttemptId: ${matchingAttempt.messageGroupId}, currentMatchingStatus: ${currentMatchingStatus}, newMatchingStatus: ${newMatchingStatus}`,
    );

    //2. save the attempt and task
    matchingAttempt.status = newMatchingStatus;
    matchingAttempt = await this.matchingAttemptService.saveTaskMatchingAttempt(
      matchingAttempt,
    );

    //3. send notification to boss
    //without await
    this.pushService.createNotificationByTemplate(
      matchingAttempt.bossUserUuid,
      PushTemplateName.HERO_DONE_TASK,
      matchingAttempt.messageGroupId,
    );

    //4. save attempt history
    const historyEntity: TaskHistory = new TaskHistory(
      matchingAttempt.taskUuid,
      matchingAttempt.messageGroupId,
      matchingAttempt.heroUserUuid,
      MessageUserRoleType.HERO,
      MatchingHistoryActionType.STATUS_CHANGE,
      currentMatchingStatus,
      newMatchingStatus,
    );
    await this.matchingAttemptService.saveTaskHistory(historyEntity);

    const rsp = new TaskMatchingAttemptRspDto(matchingAttempt);
    return new AppResponse(rsp);
  }

  async bossAcceptDone(matchingAttempt: TaskMatchingAttempt, userUuid: string) {
    const currentMatchingStatus: TaskMatchingAttemptStatus =
      matchingAttempt.status;
    const newMatchingStatus: TaskMatchingAttemptStatus =
      TaskMatchingAttemptStatus.BOSS_ACCEPT_DONE;

    //1.checking
    //only boss can do
    if (userUuid !== matchingAttempt.bossUserUuid) {
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (
      //only matched task can do
      matchingAttempt.status !== TaskMatchingAttemptStatus.HERO_DONE_TASK
    ) {
      this.logger.error(`invalid attempt status: ${matchingAttempt.status}`);
      throw new ApiException(
        ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
      );
    }
    this.logger.log(
      `[bossRejectDone] matchingAttemptId: ${matchingAttempt.messageGroupId}, currentMatchingStatus: ${currentMatchingStatus}, newMatchingStatus: ${newMatchingStatus}`,
    );

    //2. save the attempt and close this chatroom
    await this.matchingAttemptService.disableMatchingAttemptAndCloseMessageGroupAndCreateHistory(
      matchingAttempt,
      newMatchingStatus,
      MessageUserRoleType.BOSS,
      true,
    );

    //3. send notification to hero (no await)
    this.pushService.createNotificationByTemplate(
      matchingAttempt.heroUserUuid,
      PushTemplateName.BOSS_ACCEPT_DONE,
      matchingAttempt.messageGroupId,
    );

    //4. add reward to hero wallet
    await this.walletService.addHeroRewardAmtToHeroWalletByMatchingAttempt(
      matchingAttempt,
    );

    //5. save attempt history
    const historyEntity: TaskHistory = new TaskHistory(
      matchingAttempt.taskUuid,
      matchingAttempt.messageGroupId,
      matchingAttempt.bossUserUuid,
      MessageUserRoleType.BOSS,
      MatchingHistoryActionType.STATUS_CHANGE,
      currentMatchingStatus,
      newMatchingStatus,
    );
    await this.matchingAttemptService.saveTaskHistory(historyEntity);

    const rsp = new TaskMatchingAttemptRspDto(matchingAttempt);
    return new AppResponse(rsp);
  }

  async bossRejectDone(matchingAttempt: TaskMatchingAttempt, userUuid: string) {
    const currentMatchingStatus: TaskMatchingAttemptStatus =
      matchingAttempt.status;
    const newMatchingStatus: TaskMatchingAttemptStatus =
      TaskMatchingAttemptStatus.BOSS_ACCEPT_MATCHING;

    //1.checking
    //only boss can do
    if (userUuid !== matchingAttempt.bossUserUuid) {
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (
      //only matched task can do
      matchingAttempt.status !== TaskMatchingAttemptStatus.HERO_DONE_TASK
    ) {
      this.logger.error(`invalid attempt status: ${matchingAttempt.status}`);
      throw new ApiException(
        ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
      );
    }
    this.logger.log(
      `[bossRejectDone] matchingAttemptId: ${matchingAttempt.messageGroupId}, currentMatchingStatus: ${currentMatchingStatus}, newMatchingStatus: ${newMatchingStatus}`,
    );

    //2.save the attempt and task
    matchingAttempt.status = newMatchingStatus;
    matchingAttempt = await this.matchingAttemptService.saveTaskMatchingAttempt(
      matchingAttempt,
    );

    //3. send notification to hero (no await)
    this.pushService.createNotificationByTemplate(
      matchingAttempt.heroUserUuid,
      PushTemplateName.BOSS_REJECT_DONE,
      matchingAttempt.messageGroupId,
    );

    //4. save attempt history
    const historyEntity: TaskHistory = new TaskHistory(
      matchingAttempt.taskUuid,
      matchingAttempt.messageGroupId,
      matchingAttempt.bossUserUuid,
      MessageUserRoleType.BOSS,
      MatchingHistoryActionType.STATUS_CHANGE,
      currentMatchingStatus,
      newMatchingStatus,
    );
    await this.matchingAttemptService.saveTaskHistory(historyEntity);

    const rsp = new TaskMatchingAttemptRspDto(matchingAttempt);
    return new AppResponse(rsp);
  }

  async heroCancelMessageGroup(
    matchingAttempt: TaskMatchingAttempt,
    userUuid: string,
  ) {
    const currentMatchingStatus: TaskMatchingAttemptStatus =
      matchingAttempt.status;
    const newMatchingStatus: TaskMatchingAttemptStatus =
      TaskMatchingAttemptStatus.HERO_CANCEL_MESSAGE_GROUP;

    //1.checking
    //only hero can do
    if (userUuid !== matchingAttempt.heroUserUuid) {
      throw new ApiException(ResponseCode.STATUS_4013_FORBIDDEN);
    } else if (
      //only matched task can do
      matchingAttempt.status !== TaskMatchingAttemptStatus.CREATED_MESSAGE_GROUP
    ) {
      this.logger.error(`invalid attempt status: ${matchingAttempt.status}`);
      throw new ApiException(
        ResponseCode.STATUS_7012_INVALID_TASK_MATCHING_ATTEMPT_ACTION,
      );
    }
    this.logger.log(
      `[bossRejectDone] matchingAttemptId: ${matchingAttempt.messageGroupId}, currentMatchingStatus: ${currentMatchingStatus}, newMatchingStatus: ${newMatchingStatus}`,
    );

    //2. save the attempt and close this chatroom
    await this.matchingAttemptService.disableMatchingAttemptAndCloseMessageGroupAndCreateHistory(
      matchingAttempt,
      newMatchingStatus,
      MessageUserRoleType.HERO,
    );

    //3. save attempt history
    const historyEntity: TaskHistory = new TaskHistory(
      matchingAttempt.taskUuid,
      matchingAttempt.messageGroupId,
      matchingAttempt.heroUserUuid,
      MessageUserRoleType.HERO,
      MatchingHistoryActionType.STATUS_CHANGE,
      currentMatchingStatus,
      newMatchingStatus,
    );
    await this.matchingAttemptService.saveTaskHistory(historyEntity);

    const rsp = new TaskMatchingAttemptRspDto(matchingAttempt);
    return new AppResponse(rsp);
  }
}

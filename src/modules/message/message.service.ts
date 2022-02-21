import { Injectable } from '@nestjs/common';
import { MessageUtil } from '../../utils/message/message.util';
import { MessageType } from './enum/message-type';
import { MessageUserRoleType } from './enum/message-user-role-type';
import { FirebaseMessageDto } from './dto/entity/firebase-message-dto';
import { CreateMessageRspDto } from './dto/response/create-message-rsp-dto';
import { isUUID } from 'class-validator';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { FirebaseGroupDto } from './dto/entity/firebase-group-dto';

@Injectable()
export class MessageService {
  constructor(private readonly messageUtil: MessageUtil) {}
  async createCustomToken(userUUid: string): Promise<string> {
    return await this.messageUtil.createCustomToken(userUUid);
  }

  // async createMessage() {
  //   return await this.messageUtil.createMessage();
  // }

  async createMessageGroup(
    taskUuid: string,
    heroUuid: string,
    bossUuid: string,
  ) {
    return await this.messageUtil.createMessageGroup(
      taskUuid,
      bossUuid,
      heroUuid,
    );
  }

  async createMessage(
    messageGroupId: string,
    userUuid: string,
    messageType: MessageType,
    content: string,
    userRole: MessageUserRoleType,
    userName: string,
  ): Promise<CreateMessageRspDto> {
    const message: FirebaseMessageDto = await this.messageUtil.createMessage(
      messageGroupId,
      userUuid,
      messageType,
      content,
      userRole,
      userName,
    );
    return new CreateMessageRspDto(messageGroupId, message);
  }

  async validateMessageContent(
    messageType: MessageType,
    content: string,
  ): Promise<boolean> {
    if (messageType === MessageType.IMAGE) {
      //if image, check if it is a valid uuid
      const isValidUuid: boolean = isUUID(content, '4');
      if (isValidUuid !== true) {
        throw new ApiException(
          ResponseCode.STATUS_8004_MESSAGE_CONTENT_INVALID,
        );
      }
    }
    return true;
  }

  async findMessageGroupById(
    messageGroupId: string,
  ): Promise<FirebaseGroupDto> {
    return await this.messageUtil.findMessageGroupById(messageGroupId);
  }
}
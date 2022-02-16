import { Injectable } from '@nestjs/common';
import { AdminService } from './admin.service';
import { MessageService } from '../message/message.service';
import { MessageType } from '../message/enum/message-type';
import { CreateMessageRspDto } from '../message/dto/response/create-message-rsp-dto';
import { AppResponse } from '../../common/response/app.response';
import { MessageUserRoleType } from '../message/enum/message-user-role-type';
import { CreateCustomTokenRspDto } from '../message/dto/response/create-custom-token-rsp-dto';
import { FirebaseGroupDto } from '../message/dto/entity/firebase-group-dto';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';

@Injectable()
export class AdminManager {
  private readonly adminUuid = '00000000-0000-0000-0000-000000000000';

  constructor(
    private readonly adminService: AdminService,
    private readonly messageService: MessageService,
  ) {}
  async createAdminCustomToken(apiKey: string) {
    await this.adminService.verifyApiKey(apiKey);
    const customToken: string = await this.messageService.createCustomToken(
      this.adminUuid,
    );
    return new AppResponse(new CreateCustomTokenRspDto(customToken));
  }

  async createAdminMessage(
    apiKey: string,
    messageGroupId: string,
    messageType: MessageType,
    content: string,
  ) {
    //check if the messageGroupId exists
    const group: FirebaseGroupDto =
      await this.messageService.findMessageGroupById(messageGroupId);
    if (group == null) {
      throw new ApiException(ResponseCode.STATUS_8001_MESSAGE_GROUP_NOT_EXIST);
    } else if (group.active !== true) {
      throw new ApiException(ResponseCode.STATUS_8002_MESSAGE_GROUP_NOT_ACTIVE);
    }

    await this.adminService.verifyApiKey(apiKey);
    await this.messageService.validateMessageContent(messageType, content);
    const rsp: CreateMessageRspDto = await this.messageService.createMessage(
      messageGroupId,
      this.adminUuid,
      messageType,
      content,
      MessageUserRoleType.ADMIN,
      MessageUserRoleType.ADMIN,
    );
    return new AppResponse(rsp);
  }
}

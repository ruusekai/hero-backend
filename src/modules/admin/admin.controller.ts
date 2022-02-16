import { Body, Controller, Param, Post } from '@nestjs/common';
import { Public } from '../../common/decorator/public.endpoint.decorator';
import { RequiredHeader } from '../../common/decorator/required.header.decorator';
import { AdminManager } from './admin.manager';
import { CreateMessageReqDto } from '../message/dto/request/create-message-req-dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminManager: AdminManager) {}

  @Public()
  @Post('/message/custom-token')
  createAdminCustomToken(@RequiredHeader('cms-api-key') apiKey: string) {
    return this.adminManager.createAdminCustomToken(apiKey);
  }

  @Public()
  @Post('/message/group/:messageGroupId/message')
  createAdminMessage(
    @Param('messageGroupId') messageGroupId: string,
    @RequiredHeader('cms-api-key') apiKey: string,
    @Body() reqDto: CreateMessageReqDto,
  ) {
    return this.adminManager.createAdminMessage(
      apiKey,
      messageGroupId,
      reqDto.type,
      reqDto.content,
    );
  }
}

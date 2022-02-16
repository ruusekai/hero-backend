import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageManager } from './message.manager';
import { CreateMessageGroupReqDto } from './dto/request/create-message-group-req-dto';
import { CreateMessageReqDto } from './dto/request/create-message-req-dto';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageManager: MessageManager,
    private readonly messageService: MessageService,
  ) {}

  @Post('/custom-token')
  createCustomToken(@Request() req) {
    return this.messageManager.createCustomToken(req.user.uuid);
  }

  @Post('/group')
  createMessageGroup(@Request() req, @Body() reqDto: CreateMessageGroupReqDto) {
    return this.messageManager.createMessageGroup(
      reqDto.taskUuid,
      req.user.uuid,
    );
  }

  @Post('/group/:messageGroupId/message')
  createMessage(
    @Request() req,
    @Param('messageGroupId') messageGroupId: string,
    @Body() reqDto: CreateMessageReqDto,
  ) {
    return this.messageManager.createMessage(
      messageGroupId,
      req.user.uuid,
      reqDto.type,
      reqDto.content,
    );
  }
}

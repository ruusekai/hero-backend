import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { PushManager } from './push.manager';
import { PushService } from './push.service';
import { CreatePushDto } from './dto/request/create-push.dto';
import { UpdatePushDto } from './dto/request/update-push.dto';
import { PushRegisterAudienceReqDto } from './dto/request/push-register-audience-req-dto';

@Controller('push')
export class PushController {
  constructor(
    private readonly pushManager: PushManager,
    private readonly pushService: PushService,
  ) {}

  @Post()
  testPushCreate(@Request() req, @Body() createPushDto: CreatePushDto) {
    return this.pushManager.testPushCreate(req.user.uuid, createPushDto);
  }

  @Post('/audience/register')
  registerAudiencePlayerId(
    @Request() req,
    @Body() pushRegisterAudienceReqDto: PushRegisterAudienceReqDto,
  ) {
    return this.pushManager.registerAudiencePlayerId(
      pushRegisterAudienceReqDto.playerId,
      req.user.uuid,
    );
  }
}

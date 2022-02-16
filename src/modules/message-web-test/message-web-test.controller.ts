import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageWebTestService } from './message-web-test.service';
import { CreateMessageWebTestDto } from './dto/create-message-web-test.dto';
import { UpdateMessageWebTestDto } from './dto/update-message-web-test.dto';
import { ClientSignInReqDto } from './dto/client-sign-in-req-dto';

@Controller('message-web-test')
export class MessageWebTestController {
  constructor(private readonly messageWebTestService: MessageWebTestService) {}

  @Post()
  create(@Body() createMessageWebTestDto: CreateMessageWebTestDto) {
    return this.messageWebTestService.create(createMessageWebTestDto);
  }

  @Post('sign-in')
  clientSignInWithCustomToken(@Body() reqDto: ClientSignInReqDto) {
    return this.messageWebTestService.clientSignInWithCustomToken(
      reqDto.customToken,
      reqDto.messageGroupId,
    );
  }

  @Get()
  findAll() {
    return this.messageWebTestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageWebTestService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMessageWebTestDto: UpdateMessageWebTestDto,
  ) {
    return this.messageWebTestService.update(+id, updateMessageWebTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageWebTestService.remove(+id);
  }
}

import { FirebaseMessageDto } from '../entity/firebase-message-dto';

export class CreateMessageRspDto {
  constructor(messageGroupId: string, message: FirebaseMessageDto) {
    this.messageGroupId = messageGroupId;
    this.message = message;
  }
  messageGroupId: string;
  message: FirebaseMessageDto;
}

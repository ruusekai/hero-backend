export class CreateMessageGroupRspDto {
  constructor(messageGroupId: string) {
    this.messageGroupId = messageGroupId;
  }
  messageGroupId: string;
}

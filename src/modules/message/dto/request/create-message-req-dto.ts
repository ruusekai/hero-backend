import { MessageType } from '../../enum/message-type';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateMessageReqDto {
  @IsNotEmpty()
  @IsEnum(MessageType)
  type: MessageType;

  @IsNotEmpty()
  content: string;
}

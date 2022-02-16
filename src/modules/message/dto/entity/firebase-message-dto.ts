import { MessageUserRoleType } from '../../enum/message-user-role-type';
import { MessageType } from '../../enum/message-type';

export class FirebaseMessageDto {
  user: string;
  role: MessageUserRoleType;
  name: string;
  type: MessageType;
  content: string;
  timestamp: number;
}

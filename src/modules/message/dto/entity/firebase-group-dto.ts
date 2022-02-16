import { MessageUserRoleType } from '../../enum/message-user-role-type';

export class FirebaseGroupDto {
  active: boolean;
  boss: {
    id: string;
    name: string;
    role: MessageUserRoleType;
  };
  hero: {
    id: string;
    name: string;
    role: MessageUserRoleType;
  };
  task: string;
}

import { EmailTemplateDto } from './email.template.dto';
import { TaskDto } from '../../../../modules/task/dto/entity/task.dto';

export class NewTaskEmailTemplateDto implements EmailTemplateDto {
  constructor(taskDto: TaskDto, action_url: string) {
    this.task_uuid = taskDto.taskUuid;
    this.boss_user_uuid = taskDto.bossUserUuid;
    this.category = taskDto.category;
    this.description = taskDto.description;
    this.expiry_date = taskDto.expiryDate.toString();
    this.action_url = action_url;
  }
  task_uuid: string;
  boss_user_uuid: string;
  category: string;
  description: string;
  expiry_date: string;
  action_url: string;
}

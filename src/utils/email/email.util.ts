import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { HttpService } from '@nestjs/axios';
import { EmailTemplateDto } from './dto/entity/email.template.dto';
import { EmailTemplateName } from './enum/email.template.name';
import { SendEmailWithTemplateReqDto } from './dto/request/send.email.with.template.req.dto';
import { NewTaskEmailTemplateDto } from './dto/entity/new.task.email.template.dto';
import { Task } from '../../database/mysql/entities/task.entity';
import { TaskDto } from '../../modules/task/dto/entity/task.dto';

@Injectable()
export class EmailUtil {
  private readonly endpoint;
  private readonly emailServerToken;
  private readonly sendFromEmail;
  private readonly adminEmail;
  private readonly cmsActionUrl;
  private readonly logger = new Logger(EmailUtil.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.endpoint = this.configService.get<string>('email.POSTMARK_ENDPOINT');
    this.emailServerToken = this.configService.get<string>(
      'email.POSTMARK_HEADER_SERVER_TOKEN',
    );
    this.sendFromEmail = this.configService.get<string>(
      'email.SEND_FROM_EMAIL',
    );
    this.adminEmail = this.configService.get<string>('email.ADMIN_EMAIL');
    this.cmsActionUrl = this.configService.get<string>('email.CMS_ACTION_URL');
  }

  async sendEmailWithTemplateToAdmin(
    templateModel: EmailTemplateDto,
    templateAlias: EmailTemplateName,
  ) {
    return await this.sendEmailWithTemplate(
      templateModel,
      templateAlias,
      this.adminEmail,
    );
  }

  async sendEmailWithTemplate(
    templateModel: EmailTemplateDto,
    templateAlias: EmailTemplateName,
    toEmail: string,
  ) {
    try {
      const axiosConfig: any = {
        baseURL: this.endpoint,
        url: '/email/withTemplate',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': this.emailServerToken,
        },
        timeout: 100000,
        method: 'POST',
      };
      const data: SendEmailWithTemplateReqDto = new SendEmailWithTemplateReqDto(
        this.sendFromEmail,
        toEmail,
        templateAlias,
        templateModel,
      );

      axiosConfig.data = data;
      axiosConfig.params = {};
      const rsp = await lastValueFrom(this.httpService.request(axiosConfig));
      this.logger.log(
        '[EmailUtil][sendEmailWithTemplate] rsp:' + JSON.stringify(rsp.data),
      );
      return rsp.data;
    } catch (e) {
      this.logger.error(
        '[EmailUtil][sendEmailWithTemplate] email error: ' +
          JSON.stringify(e.stack),
      );
      throw new ApiException(ResponseCode.STATUS_8300_EMAIL_ERROR, e);
    }
  }

  async sendTemplateForNewTaskToAdmin(taskDto: TaskDto): Promise<boolean> {
    const actionUrl = `${this.cmsActionUrl}/task/${taskDto.taskUuid}`;
    const templateModel: NewTaskEmailTemplateDto = new NewTaskEmailTemplateDto(
      taskDto,
      actionUrl,
    );
    await this.sendEmailWithTemplateToAdmin(
      templateModel,
      EmailTemplateName.NEW_TASK,
    );
    return true;
  }
}

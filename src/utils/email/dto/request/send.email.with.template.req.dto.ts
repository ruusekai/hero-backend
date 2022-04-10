import { EmailTemplateDto } from '../entity/email.template.dto';
import { EmailTemplateName } from '../../enum/email.template.name';

export class SendEmailWithTemplateReqDto {
  constructor(
    From: string,
    To: string,
    TemplateAlias: EmailTemplateName,
    TemplateModel: EmailTemplateDto,
  ) {
    this.From = From;
    this.To = To;
    this.TemplateAlias = TemplateAlias;
    this.TemplateModel = TemplateModel;
  }
  From: string;
  To: string;
  TemplateAlias: EmailTemplateName;
  TemplateModel: EmailTemplateDto;
}

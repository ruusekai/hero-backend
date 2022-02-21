import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { PushTemplateName } from '../../../common/enum/push.template.name';
import { PushTemplate } from '../entities/push.template.entity';

@EntityRepository(PushTemplate)
@Injectable()
export class PushTemplateRepository extends Repository<PushTemplate> {
  constructor() {
    super();
  }

  async findOnePushTemplateByName(
    name: PushTemplateName,
  ): Promise<PushTemplate> {
    try {
      return await this.findOne({
        where: { name: name, isDeleted: false },
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

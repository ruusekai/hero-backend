import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { Report } from '../entities/Report.entity';

@EntityRepository(Report)
@Injectable()
export class ReportRepository extends Repository<Report> {
  constructor() {
    super();
  }

  async saveReport(Report: Report): Promise<Report> {
    try {
      Report.updatedDate = new Date(Date.now());
      return await this.save(Report);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}

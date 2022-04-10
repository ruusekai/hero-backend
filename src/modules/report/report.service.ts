import { Injectable, Logger } from '@nestjs/common';
import { ReportRepository } from '../../database/mysql/repositories/report.repository';
import { Report } from '../../database/mysql/entities/report.entity';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepo: ReportRepository) {}
  private readonly logger = new Logger(ReportService.name);

  async saveReport(report: Report): Promise<Report> {
    return await this.reportRepo.saveReport(report);
  }
}

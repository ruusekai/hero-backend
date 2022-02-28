import { Injectable, Logger } from '@nestjs/common';
import { ReportService } from './report.service';
import { Report } from '../../database/mysql/entities/report.entity';
import { ReportType } from './enum/report.type';
import { AppResponse } from '../../common/response/app.response';
import { TaskService } from '../task/task.service';
import { Task } from '../../database/mysql/entities/task.entity';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { ReviewService } from '../review/review.service';
import { Review } from '../../database/mysql/entities/review.entity';

@Injectable()
export class ReportManager {
  private readonly logger = new Logger(ReportManager.name);

  constructor(
    private readonly reportService: ReportService,
    private readonly taskService: TaskService,
    private readonly reviewService: ReviewService,
  ) {}

  async createTaskReport(
    description: string,
    userUuid: string,
    taskUuid: string,
  ) {
    const task: Task = await this.taskService.findOneTaskByUuid(taskUuid);
    if (task == null) {
      throw new ApiException(ResponseCode.STATUS_7010_TASK_NOT_EXIST);
    } else if (task.bossUserUuid) {
      throw new ApiException(ResponseCode.STATUS_8200_SELF_REPORT_NOT_ALLOWED);
    }
    let report: Report = new Report(
      userUuid,
      ReportType.TASK,
      taskUuid,
      description,
    );
    report = await this.reportService.saveReport(report);
    return new AppResponse();
  }

  async createReviewReport(
    description: string,
    userUuid: string,
    reviewUuid: string,
  ) {
    const review: Review = await this.reviewService.findOneReviewByUuid(
      reviewUuid,
    );
    if (review == null) {
      this.logger.error(`review uuid not found: ${reviewUuid}`);
      throw new ApiException(ResponseCode.STATUS_9999_SYSTEM_ERROR);
    } else if (review.fromUserUuid) {
      throw new ApiException(ResponseCode.STATUS_8200_SELF_REPORT_NOT_ALLOWED);
    }
    let report: Report = new Report(
      userUuid,
      ReportType.REVIEW,
      reviewUuid,
      description,
    );
    report = await this.reportService.saveReport(report);
    return new AppResponse();
  }
}

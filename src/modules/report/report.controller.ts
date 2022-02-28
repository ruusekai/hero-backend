import { Body, Controller, Param, Post, Request } from '@nestjs/common';
import { ReportManager } from './report.manager';
import { CreateReviewReportReqDto } from './dto/create.review.report.req.dto';
import { CreateTaskReportReqDto } from './dto/create.task.report.req.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportManager: ReportManager) {}

  @Post('/task/:taskUuid')
  createTaskReport(
    @Request() req,
    @Body() createTaskReportReqDto: CreateTaskReportReqDto,
    @Param('taskUuid') taskUuid: string,
  ) {
    return this.reportManager.createTaskReport(
      createTaskReportReqDto.description,
      req.user.uuid,
      taskUuid,
    );
  }

  @Post('/review/:reviewUuid')
  createReviewReport(
    @Request() req,
    @Body() createReviewReportReqDto: CreateReviewReportReqDto,
    @Param('reviewUuid') reviewUuid: string,
  ) {
    return this.reportManager.createReviewReport(
      createReviewReportReqDto.description,
      req.user.uuid,
      reviewUuid,
    );
  }
}

import { IsNotEmpty } from 'class-validator';

export class CreateReviewReportReqDto {
  @IsNotEmpty()
  description: string;
}

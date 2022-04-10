import { IsNotEmpty } from 'class-validator';

export class CreateTaskReportReqDto {
  @IsNotEmpty()
  description: string;
}

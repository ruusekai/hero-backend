import { IsNotEmpty } from 'class-validator';
import { TaskDto } from '../entity/task.dto';
import { PaginateRspDto } from '../../../../common/dto/response/paginate.rsp.dto';

export class FindTaskRspDto {
  @IsNotEmpty()
  tasks: TaskDto[];

  paginate: PaginateRspDto;

  constructor(tasks: TaskDto[], paginate: PaginateRspDto) {
    this.tasks = tasks;
    this.paginate = paginate;
  }
}

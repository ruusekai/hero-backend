import { IsNotEmpty } from 'class-validator';

export class CreateMessageGroupReqDto {
  @IsNotEmpty()
  taskUuid: string;
}

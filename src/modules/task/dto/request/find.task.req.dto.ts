import { IsEnum, IsOptional } from 'class-validator';
import { PaginateReqDto } from '../../../../common/dto/request/paginate.req.dto';
import { TaskOrderByColumn } from '../../enum/task.order.by.column';
import { OrderDirection } from '../../enum/order.direction';

export class FindTaskReqDto extends PaginateReqDto {
  @IsOptional()
  //names with comma as delimiter (e.g. districtId=HK-E,HK-S)
  districtIds: string;

  @IsOptional()
  //tagIds with comma as delimiter (e.g. category=business,casual)
  categories: string;

  @IsOptional()
  minHeroRewardAmt: number;

  @IsOptional()
  maxHeroRewardAmt: number;

  @IsOptional()
  currentLocation: string;

  @IsOptional()
  @IsEnum(TaskOrderByColumn)
  orderBy: TaskOrderByColumn;

  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection: OrderDirection;
}

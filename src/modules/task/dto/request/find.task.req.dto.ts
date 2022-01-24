import { IsOptional } from 'class-validator';
import { PaginateReqDto } from '../../../../common/dto/request/paginate.req.dto';

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
}

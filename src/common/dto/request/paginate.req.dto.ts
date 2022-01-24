import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginateReqDto {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  limit?: number = 10;
}

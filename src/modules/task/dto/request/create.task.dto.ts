import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskCategory } from '../../enum/task.category';

export class CreateTaskDto {
  // todo: change banner to isnotempty once images are ready
  @IsOptional()
  banner: string;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  basicCostAmt: number;
  @IsNotEmpty()
  heroRewardAmt: number;
  @IsNotEmpty()
  totalChargeAmt: number;
  @IsNotEmpty()
  expiryDate: Date;

  @IsOptional()
  description: string;
  @IsOptional()
  regionId: string;
  @IsOptional()
  districtId: string;
  @IsOptional()
  address: string;
  @IsOptional()
  latitude: string;
  @IsOptional()
  longitude: string;
}

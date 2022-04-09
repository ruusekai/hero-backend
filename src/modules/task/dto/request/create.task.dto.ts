import { IsNotEmpty, IsOptional } from 'class-validator';

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
  serviceChargeAmt: number;
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

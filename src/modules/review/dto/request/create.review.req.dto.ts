import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReviewReqDto {
  @IsNotEmpty()
  score: number;

  @IsOptional()
  description: string;
}

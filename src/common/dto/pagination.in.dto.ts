import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional()
  readonly page?: number;

  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional()
  readonly limit?: number;
}

export class SortQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly sort?: 'asc' | 'desc';
}

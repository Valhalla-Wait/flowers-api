import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
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

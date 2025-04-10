import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateConsumableDto {
  @IsString()
  @ApiProperty()
  readonly title: string;

  @IsNumber()
  @ApiProperty()
  readonly count: number;
}

export class UpdateConsumableDto extends PartialType(CreateConsumableDto) {}

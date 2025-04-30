import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@Expose()
export class DatesOutDto {
  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;
}

@Expose()
export class IdOutDto {
  @Expose()
  @ApiProperty()
  id: string;
}

@Expose()
export class IdWithDatesOutDto extends IntersectionType(IdOutDto, DatesOutDto) {}

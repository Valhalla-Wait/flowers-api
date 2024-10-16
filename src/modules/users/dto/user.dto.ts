import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CreateUserDto {
  @Expose()
  @Type(() => Number)
  @ApiProperty()
  readonly vkId: number;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  readonly firstName: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  readonly lastName: string;
}

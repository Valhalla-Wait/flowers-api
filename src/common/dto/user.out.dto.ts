import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { DatesOutDto } from '@/common/dto/common.out.dto';

@Exclude()
export class UserOutDto extends DatesOutDto {
  @Expose()
  @ApiProperty()
  firstName: string;

  @Expose()
  @ApiProperty()
  lastName: string;

  @Expose()
  @ApiProperty()
  phone: string;
}

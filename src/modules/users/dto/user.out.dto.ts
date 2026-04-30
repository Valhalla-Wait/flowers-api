import { DatesOutDto } from '@/common/dto/common.out.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Roles } from '@/modules/users/types';

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

  @Expose()
  @ApiProperty()
  role: Roles;
}

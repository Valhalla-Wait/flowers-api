import { UserOutDto } from '@/common/dto/user.out.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class OutputAuth {
  @Expose()
  @ApiProperty({ type: UserOutDto })
  @Type(() => UserOutDto)
  readonly data: UserOutDto;
}

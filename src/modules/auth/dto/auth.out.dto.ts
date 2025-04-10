import { OutputUser } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class OutputAuth {
  @Expose()
  @ApiProperty({ type: OutputUser })
  @Type(() => OutputUser)
  readonly data: OutputUser;
}

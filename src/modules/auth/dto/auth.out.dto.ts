import { OutputUser } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OutputAuth {
  @Expose()
  @ApiProperty({ type: OutputUser })
  readonly user: OutputUser;
}

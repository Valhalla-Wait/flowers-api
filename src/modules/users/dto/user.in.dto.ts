import { RegisterUserInDto } from '@/modules/auth/dto/auth.in.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UpdateUserDto extends PartialType(OmitType(RegisterUserInDto, ['tempCartProducts'])) {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  readonly firstName: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  readonly lastName: string;
}

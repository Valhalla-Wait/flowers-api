import { ProductOutDto } from '@/modules/products/dto/product.out.dto';
import { UserOutDto } from '@/modules/users/dto/user.out.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class AuthOutDto {
  @Expose()
  @ApiProperty({ type: UserOutDto })
  @Type(() => UserOutDto)
  readonly data: UserOutDto;

  @Expose()
  @ApiProperty({ type: ProductOutDto, isArray: true })
  @Type(() => ProductOutDto)
  readonly success?: ProductOutDto[];

  @Expose()
  @ApiProperty({ type: ProductOutDto, isArray: true })
  @Type(() => ProductOutDto)
  readonly failed?: ProductOutDto[];
}

@Exclude()
export class AuthAdminOutDto extends PickType(AuthOutDto, ['data']) {}

import { ApiProperty } from '@nestjs/swagger';
import { DatesOutDto } from '@/common/dto/common.out.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { ProductOutDto } from '@/modules/products/dto/product.out.dto';
import { UserOutDto } from '@/modules/users/dto/user.out.dto';

@Exclude()
export class FavoriteOutDto extends DatesOutDto {
  @Expose()
  @ApiProperty()
  @Type(() => ProductOutDto)
  product: ProductOutDto;

  @Expose()
  @ApiProperty()
  user: UserOutDto;
}

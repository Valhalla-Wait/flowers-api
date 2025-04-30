import { DatesOutDto } from '@/common/dto/common.out.dto';
import { ProductOutDto } from '@/modules/products/dto/product.out.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

@Exclude()
export class ProductCartOutDto extends DatesOutDto {
  @Expose()
  @ApiProperty()
  @Type(() => OmitType(ProductOutDto, ['consumables']))
  product: ProductOutDto;

  @Expose()
  @ApiProperty()
  count: number;

  @Expose()
  @ApiProperty()
  @Transform(({ obj }) => obj.count * obj.product.price)
  productTotalPrice: number;
}

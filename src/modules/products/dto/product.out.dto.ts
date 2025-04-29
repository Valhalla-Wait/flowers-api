import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { CreateProductDto } from '@/modules/products/dto/product.in.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ConsumableOutDto } from '@/modules/consumables/dto/consumables.out.dto';
import { CustomClassTransformOptions } from '@/common/types';

@Exclude()
export class ProductOutDto extends CreateProductDto {
  @Expose()
  @ApiProperty()
  id: string;

  // TODO: Выводить только для админа
  @Expose()
  @ApiProperty()
  isAvailable: boolean;

  @Expose()
  @ApiProperty()
  @Transform(
    ({ obj, options }) => (options as CustomClassTransformOptions)?.customPrice ?? obj.price,
  )
  price: number;

  @Expose()
  @ApiProperty()
  @Transform(({ obj }) =>
    obj.productConsumables.every(
      ({ requiredCount, consumable }) => requiredCount <= consumable.count,
    ),
  )
  inStock: boolean;
}

@Exclude()
export class ProductConsumableOutDto extends ConsumableOutDto {
  @Expose()
  @ApiProperty()
  requiredCount: number;
}
@Exclude()
export class ProductDetailOutDto extends ProductOutDto {
  @Expose()
  @ApiProperty()
  @Type(() => ProductConsumableOutDto)
  consumables: ProductConsumableOutDto[];
}

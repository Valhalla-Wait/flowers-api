import { Exclude, Expose, Type } from 'class-transformer';
import { CreateProductDto } from '@/modules/products/dto/product.in.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ConsumableOutDto } from '@/modules/consumables/dto/consumables.out.dto';

@Exclude()
export class ProductOutDto extends CreateProductDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  isAvailable: boolean;
}

@Exclude()
export class ProductDetailOutDto extends ProductOutDto {
  @Expose()
  @ApiProperty()
  @Type(() => ConsumableOutDto)
  consumables: ConsumableOutDto[];
}

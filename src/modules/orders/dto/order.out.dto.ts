import { ProductCartOutDto } from '@/modules/cart/dto/cart.out.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { OrderStatus } from '@/modules/orders/entities/order.entity';
import { ProductOutDto } from '@/modules/products/dto/product.out.dto';
import { CustomClassTransformOptions } from '@/common/types';

@Exclude()
export class OrderProductOutDto extends ProductCartOutDto {
  @Expose()
  @ApiProperty({
    enum: OrderStatus,
  })
  @Transform(({ obj }) => obj.order.status)
  status: OrderStatus;

  @Expose()
  @ApiProperty()
  @Transform(({ obj }) =>
    plainToInstance(ProductOutDto, obj.product, {
      customPrice: obj.price,
    } as CustomClassTransformOptions),
  )
  product: ProductOutDto;

  @Expose()
  @ApiProperty()
  @Transform(({ obj }) => obj.count * obj.price)
  productTotalPrice: number;
}

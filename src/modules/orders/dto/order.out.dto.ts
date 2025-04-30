import { ProductCartOutDto } from '@/modules/cart/dto/cart.out.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { OrderStatus } from '@/modules/orders/entities/order.entity';
import { CustomClassTransformOptions } from '@/common/types';
import { IdWithDatesOutDto } from '@/common/dto/common.out.dto';

@Exclude()
export class OrderProductOutDto extends ProductCartOutDto {}

@Exclude()
export class OrderOutDto extends IdWithDatesOutDto {
  @Expose()
  @ApiProperty({
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Expose()
  @ApiProperty()
  @Transform(({ obj }) =>
    plainToInstance(OrderProductOutDto, obj.orderProducts, {
      customPrice: obj.price,
    } as CustomClassTransformOptions),
  )
  products: OrderProductOutDto;

  @Expose()
  @ApiProperty()
  @Transform(({ obj }) =>
    obj.orderProducts.reduce((totalPrice, { count, price }) => totalPrice + count * price, 0),
  )
  totalPrice: number;
}

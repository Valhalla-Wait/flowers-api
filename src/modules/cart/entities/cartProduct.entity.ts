import { ProductEntity } from '@/modules/products/entities/product.entity';
import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { CartEntity } from '@/modules/cart/entities/cart.entity';

@Entity('cart_products')
@Unique(['product', 'cart'])
export class CartProductEntity extends BaseEntityWithDatesAndIdColumns {
  @Column({
    default: 0,
  })
  count: number;

  @ManyToOne(() => ProductEntity, (product) => product.cartProducts, {
    onDelete: 'CASCADE',
  })
  public product: ProductEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.cartProducts, {
    onDelete: 'CASCADE',
  })
  public cart: CartEntity;
}

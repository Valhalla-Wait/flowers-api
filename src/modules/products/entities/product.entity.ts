import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductConsumableEntity } from '@/modules/products/entities/productConsumables.entity';
import { CartProductEntity } from '@/modules/cart/entities/cartProduct.entity';
import { OrderProductEntity } from '@/modules/orders/entities/orderProduct.entity';
import { FavoriteEntity } from '@/modules/favorites/entities/favorite.entity';

@Entity('products')
export class ProductEntity extends BaseEntityWithDatesAndIdColumns {
  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  photo: string;

  @Column({
    default: true,
  })
  isAvailable: boolean;

  @OneToMany(() => CartProductEntity, (cartProduct) => cartProduct.product)
  cartProducts: CartProductEntity[];

  @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.product)
  orderProducts: OrderProductEntity[];

  @OneToMany(() => ProductConsumableEntity, (productConsumables) => productConsumables.product)
  productConsumables: ProductConsumableEntity[];

  @OneToMany(() => FavoriteEntity, (favorite) => favorite.product)
  favorites: FavoriteEntity[];
}

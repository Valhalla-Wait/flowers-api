import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductConsumablesEntity } from '@/modules/products/entities/productConsumables.entity';
import { CartEntity } from '@/modules/cart/entities/cart.entity';

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

  @OneToMany(() => CartEntity, (cart) => cart.product)
  productCarts: CartEntity[];

  @OneToMany(() => ProductConsumablesEntity, (productConsumables) => productConsumables.product)
  productConsumables: ProductConsumablesEntity[];
}

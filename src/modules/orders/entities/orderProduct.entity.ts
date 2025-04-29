import { ProductEntity } from '@/modules/products/entities/product.entity';
import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { OrderEntity } from '@/modules/orders/entities/order.entity';

@Entity('orders_products')
export class OrderProductEntity extends BaseEntityWithDatesAndIdColumns {
  @Column({
    nullable: false,
  })
  count: number;

  @Column({ nullable: false })
  price: number;

  @ManyToOne(() => ProductEntity, (product) => product.orderProducts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public product: ProductEntity;

  @ManyToOne(() => OrderEntity, (order) => order.orderProducts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public order: OrderEntity;

  @BeforeInsert()
  priceFixing() {
    this.price = this.product.price;
  }
}

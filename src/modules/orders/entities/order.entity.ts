import { UserEntity } from '@/modules/users/entities/user.entity';
import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderProductEntity } from '@/modules/orders/entities/orderProduct.entity';

export enum OrderStatus {
  // Заказ в обработке
  IN_PROCESS = 'in_process',

  // Заказ взят в работу
  IN_WORK = 'in_work',

  // Заказ доставляется
  DELIVERY = 'delivery',

  // Заказ выполнен
  COMPLETED = 'completed',

  // Заказ отменен
  CANCELED = 'canceled',
}

@Entity('orders')
export class OrderEntity extends BaseEntityWithDatesAndIdColumns {
  @Column({ enum: OrderStatus, default: OrderStatus.IN_PROCESS })
  status: OrderStatus;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public user: UserEntity;

  @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.order)
  orderProducts: OrderProductEntity[];
}

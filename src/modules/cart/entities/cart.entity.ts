import { ProductEntity } from '@/modules/products/entities/product.entity';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity('cart')
@Unique(['user', 'product'])
export class CartEntity extends BaseEntityWithDatesAndIdColumns {
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public user: UserEntity;

  @ManyToOne(() => ProductEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
  public product: ProductEntity;

  @Column({
    default: 0,
  })
  count: number;
}

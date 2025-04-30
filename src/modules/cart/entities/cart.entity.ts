import { UserEntity } from '@/modules/users/entities/user.entity';
import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { CartProductEntity } from '@/modules/cart/entities/cartProduct.entity';

@Entity('cart')
@Unique(['user'])
export class CartEntity extends BaseEntityWithDatesAndIdColumns {
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public user: UserEntity;

  @OneToMany(() => CartProductEntity, (cartProducts) => cartProducts.cart)
  cartProducts: CartProductEntity[];
}

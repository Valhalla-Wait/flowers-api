import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Roles } from '@/modules/users/types';
import { CartEntity } from '@/modules/cart/entities/cart.entity';

@Entity('users')
export class UserEntity extends BaseEntityWithDatesAndIdColumns {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    unique: true,
  })
  phone: string;

  @Column()
  password: string;

  @Column({
    enum: Roles,
  })
  role: Roles;

  @Column({ type: 'uuid', nullable: true })
  lastAccessTokenId: string | null;

  @OneToMany(() => CartEntity, (cart) => cart.user)
  userCarts: CartEntity[];
}

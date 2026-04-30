import { ProductEntity } from '@/modules/products/entities/product.entity';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity('favorites')
export class FavoriteEntity extends BaseEntityWithDatesAndIdColumns {
  @ManyToOne(() => ProductEntity, (product) => product.favorites, {
    onDelete: 'CASCADE',
  })
  public product: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.favorites, {
    onDelete: 'CASCADE',
  })
  public user: UserEntity;
}

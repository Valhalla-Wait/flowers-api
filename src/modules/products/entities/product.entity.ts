import { ConsumableEntity } from '@/modules/consumables/entities/consumable.entity';
import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

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

  @ManyToMany(() => ConsumableEntity)
  @JoinTable()
  consumables: ConsumableEntity[];
}

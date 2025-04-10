import { ProductConsumablesEntity } from '@/modules/products/entities/productConsumables.entity';
import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('consumables')
export class ConsumableEntity extends BaseEntityWithDatesAndIdColumns {
  @Column()
  title: string;

  @Column()
  count: number;

  @OneToMany(() => ProductConsumablesEntity, (productConsumables) => productConsumables.consumable)
  productConsumables: ProductConsumablesEntity[];
}

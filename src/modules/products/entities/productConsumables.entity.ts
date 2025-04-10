import { Column, Entity, ManyToOne } from 'typeorm';
import { ProductEntity } from '@/modules/products/entities/product.entity';
import { ConsumableEntity } from '@/modules/consumables/entities/consumable.entity';
import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';

@Entity('productConsumables')
export class ProductConsumablesEntity extends BaseEntityWithDatesAndIdColumns {
  @Column()
  requiredCount: number;

  @ManyToOne(() => ProductEntity, (product) => product.productConsumables, {
    onDelete: 'CASCADE',
  })
  public product: ProductEntity;

  @ManyToOne(() => ConsumableEntity, (consumable) => consumable.productConsumables, {
    onDelete: 'CASCADE',
  })
  public consumable: ConsumableEntity;
}

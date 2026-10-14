import { Entity, ManyToOne } from 'typeorm';
import { ProductEntity } from '@/modules/products/entities/product.entity';
import { TagEntity } from '@/modules/tags/entities/tag.entity';
import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';

@Entity('product_tags')
export class ProductTagEntity extends BaseEntityWithDatesAndIdColumns {
  @ManyToOne(() => ProductEntity, (product) => product.productTags, {
    onDelete: 'CASCADE',
  })
  public product: ProductEntity;

  @ManyToOne(() => TagEntity, (tag) => tag.productTags, {
    onDelete: 'CASCADE',
  })
  public tag: TagEntity;
}

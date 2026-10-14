import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductTagEntity } from '@/modules/products/entities/productTag.entity';

@Entity('tags')
export class TagEntity extends BaseEntityWithDatesAndIdColumns {
  @Column({
    unique: true,
  })
  title: string;

  @OneToMany(() => ProductTagEntity, (productTag) => productTag.tag)
  productTags: ProductTagEntity[];
}

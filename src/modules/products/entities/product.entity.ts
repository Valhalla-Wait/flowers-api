import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Column, Entity } from 'typeorm';

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
}

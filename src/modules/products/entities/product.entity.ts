import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('products')
export class Product extends BaseEntityWithDatesAndIdColumns {
  @Column()
  title: string;

  @Column()
  price: number;
}

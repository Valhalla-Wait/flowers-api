import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('consumables')
export class ConsumableEntity extends BaseEntityWithDatesAndIdColumns {
  @Column()
  title: string;

  @Column()
  count: number;
}

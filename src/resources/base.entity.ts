import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

type BaseEntityTypeWithDatesColumns = { createdAt: Date; updatedAt: Date };
type BaseEntityTypeWithDatesAndIdColumns = BaseEntityTypeWithDatesColumns & { id: string };

export type BaseEntityType<WithId extends boolean> = WithId extends true
  ? BaseEntityTypeWithDatesAndIdColumns
  : BaseEntityTypeWithDatesColumns;

export class BaseEntityWithDatesColumns extends BaseEntity implements BaseEntityType<false> {
  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'LOCALTIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'LOCALTIMESTAMP',
  })
  updatedAt: Date;
}

export class BaseEntityWithDatesAndIdColumns
  extends BaseEntityWithDatesColumns
  implements BaseEntityType<true>
{
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

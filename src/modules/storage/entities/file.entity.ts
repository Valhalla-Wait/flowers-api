import { Column, Entity } from 'typeorm';
import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('files')
export class FileEntity extends BaseEntityWithDatesAndIdColumns {
  @ApiProperty()
  @Column()
  originalName: string;

  @ApiProperty()
  @Column()
  mimeType: string;

  @ApiProperty()
  @Column('int')
  size: number;

  @ApiProperty()
  @Column()
  key: string;

  @ApiProperty()
  @Column()
  url: string;
}

import { Column, Entity } from 'typeorm';

import { BaseEntityWithDatesAndIdColumns } from '@/resources/base.entity';
import { Roles } from '@/modules/users/types';

@Entity('users')
export class UserEntity extends BaseEntityWithDatesAndIdColumns {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    unique: true,
  })
  phone: string;

  @Column()
  password: string;

  @Column({
    enum: Roles,
  })
  role: Roles;

  @Column({ type: 'uuid', nullable: true })
  lastAccessTokenId: string | null;
}

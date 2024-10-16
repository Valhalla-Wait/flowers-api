import { Repository } from 'typeorm';

import { UsersService } from '@/modules/users/users.service';
import { UserEntity } from '@/modules/users/entities/user.entity';

export type TestInjects = Partial<{
  usersService: UsersService;
  usersRepository: Repository<UserEntity>;
}>;

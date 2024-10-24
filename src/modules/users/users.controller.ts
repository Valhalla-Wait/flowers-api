import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

import { UsersService } from '@/modules/users/users.service';
import { Public } from '@/auth/decorators/is-public';
import { User } from '@/decorators/user.decorator';
import { OutputUser } from '@/common/dto';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '@/modules/users/entities/user.entity';

@Controller('users')
@ApiTags('Пользователи')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}

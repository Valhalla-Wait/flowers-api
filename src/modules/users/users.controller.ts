import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

import { UsersService } from '@/modules/users/users.service';

@Controller('users')
@ApiTags('Пользователи')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}

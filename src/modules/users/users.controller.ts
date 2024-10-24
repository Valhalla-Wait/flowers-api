import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@Controller('users')
@ApiTags('Пользователи')
export class UsersController {
  constructor() {}
}

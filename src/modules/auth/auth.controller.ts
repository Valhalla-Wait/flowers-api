import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Controller, Post, Body, Get } from '@nestjs/common';

import { OutputUser } from '@/common/dto';
import { AuthDto } from '@/modules/auth/dto/auth.in.dto';
import { OutputAuth } from '@/modules/auth/dto/auth.out.dto';

import { User } from '@/decorators/user.decorator';
import { Public } from '@/auth/decorators/is-public';
import { AuthService } from '@/modules/auth/auth.service';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { ApiDocumentation } from '@/decorators/documentation.decorator';

@Controller('auth')
@ApiTags('Авторизация')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Public()
  @ApiDocumentation({
    type: OutputAuth,
    summary: 'Авторизация/регистрация пользователя в системе',
  })
  async auth(@Body() data: AuthDto) {
    const result = await this.authService.auth(data);
    return plainToInstance(OutputAuth, result);
  }

  @Get('/me')
  @ApiDocumentation({
    type: OutputUser,
    summary: 'Получить информацию о пользователе',
  })
  getInfo(@User() user: UserEntity) {
    return plainToInstance(OutputUser, user);
  }
}

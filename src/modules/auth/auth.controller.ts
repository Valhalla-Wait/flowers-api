import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Controller, Post, Body, Get, Res } from '@nestjs/common';

import {
  LoginAdminInDto,
  LoginUserInDto,
  RegisterUserInDto,
  ResetPasswordInDto,
} from '@/modules/auth/dto/auth.in.dto';
import { AuthAdminOutDto, AuthOutDto } from '@/modules/auth/dto/auth.out.dto';

import { User } from '@/decorators/user.decorator';
import { Public } from '@/auth/decorators/is-public';
import { AuthService } from '@/modules/auth/auth.service';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { ApiDocumentation } from '@/decorators/documentation.decorator';
import { setTokenCookies } from '@/utils/set-token-cookies';
import { Response } from 'express';
import { clearTokenCookies } from '@/utils/clear-token-cookies';
import { UserOutDto } from '@/modules/users/dto/user.out.dto';

@Controller('auth')
@ApiTags('Авторизация')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Public({
    withoutAdminProtection: true,
  })
  @ApiDocumentation({
    type: AuthOutDto,
    summary: 'Авторизация пользователя в системе',
  })
  async login(@Body() data: LoginUserInDto, @Res() res: Response) {
    const { user, ...tokens } = await this.authService.login(data);

    for (const token in tokens) {
      setTokenCookies(res, tokens[token], token);
    }

    return res.send(plainToInstance(AuthOutDto, { data: user }));
  }

  @Post('admin-sign-in')
  @Public({
    withoutAdminProtection: true,
  })
  @ApiDocumentation({
    type: AuthAdminOutDto,
    summary: 'Авторизация администратора в системе',
  })
  async adminLogin(@Body() data: LoginAdminInDto, @Res() res: Response) {
    const { user, ...tokens } = await this.authService.adminLogin(data);

    for (const token in tokens) {
      setTokenCookies(res, tokens[token], token);
    }

    return res.send(plainToInstance(AuthAdminOutDto, { data: user }));
  }

  @Post('sign-up')
  @Public({
    withoutAdminProtection: true,
  })
  @ApiDocumentation({
    type: AuthOutDto,
    summary: 'Регистрация пользователя в системе',
  })
  async register(@Body() data: RegisterUserInDto, @Res() res: Response) {
    const { user, ...tokens } = await this.authService.register(data);

    for (const token in tokens) {
      setTokenCookies(res, tokens[token], token);
    }

    return res.send(plainToInstance(AuthOutDto, { data: user }));
  }

  @Post('reset-admin')
  @ApiDocumentation({
    type: AuthOutDto,
    summary: 'Сбросить пароль',
  })
  async resetPassword(@Body() data: ResetPasswordInDto) {
    return this.authService.resetAdminPassword(data);
  }

  @Post('logout')
  @ApiDocumentation({
    type: String,
    summary: 'Выйти из системы',
  })
  async logout(@User() user: UserEntity, @Res() res: Response) {
    await this.authService.logoutUser(user);

    clearTokenCookies(res);

    return res.send({
      message: 'Success',
    });
  }

  @Get('/me')
  @ApiDocumentation({
    type: UserOutDto,
    summary: 'Получить информацию о пользователе',
  })
  getInfo(@User() user: UserEntity) {
    return plainToInstance(UserOutDto, user);
  }
}

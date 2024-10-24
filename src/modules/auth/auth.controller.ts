import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Controller, Post, Body, Get, Res } from '@nestjs/common';

import { OutputUser } from '@/common/dto';
import { LoginUserInDto, ResetPasswordInDto } from '@/modules/auth/dto/auth.in.dto';
import { OutputAuth } from '@/modules/auth/dto/auth.out.dto';

import { User } from '@/decorators/user.decorator';
import { Public } from '@/auth/decorators/is-public';
import { AuthService } from '@/modules/auth/auth.service';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { ApiDocumentation } from '@/decorators/documentation.decorator';
import { setTokenCookies } from '@/utils/set-token-cookies';
import { Response } from 'express';
import { clearTokenCookies } from '@/utils/clear-token-cookies';

@Controller('auth')
@ApiTags('Авторизация')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Public({
    withoutAdminProtection: true,
  })
  @ApiDocumentation({
    type: OutputAuth,
    summary: 'Авторизация пользователя в системе',
  })
  async login(@Body() data: LoginUserInDto, @Res() res: Response) {
    const { user, ...tokens } = await this.authService.loginUser(data);

    for (const token in tokens) {
      setTokenCookies(res, tokens[token], token);
    }

    res.send({ user });

    return plainToInstance(OutputAuth, user);
  }

  @Post('sign-up')
  @ApiDocumentation({
    type: OutputAuth,
    summary: 'Регистрация пользователя в системе',
  })
  async register(@Body() data: LoginUserInDto, @Res() res: Response) {
    const { user, ...tokens } = await this.authService.registerUser(data);

    for (const token in tokens) {
      setTokenCookies(res, tokens[token], token);
    }

    res.send({ user });

    return plainToInstance(OutputAuth, user);
  }

  @Post('reset')
  @ApiDocumentation({
    type: OutputAuth,
    summary: 'Сбросить пароль',
  })
  async resetPassword(@Body() data: ResetPasswordInDto) {
    return this.authService.resetPassword(data);
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
    type: OutputUser,
    summary: 'Получить информацию о пользователе',
  })
  getInfo(@User() user: UserEntity) {
    return plainToInstance(OutputUser, user);
  }
}

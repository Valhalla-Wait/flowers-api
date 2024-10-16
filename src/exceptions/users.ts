import { HttpException, HttpStatus } from '@nestjs/common';

export class UsersExceptions {
  static Unauthorized() {
    // NOTE
    // Текст ошибки такой же как UserNotFound, но статус другой
    // Используется при валидации пользовательского токена
    throw new HttpException('Пользователь не найден', HttpStatus.UNAUTHORIZED);
  }

  static UserNotFound() {
    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }
}

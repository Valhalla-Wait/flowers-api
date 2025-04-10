import { HttpException, HttpStatus } from '@nestjs/common';

export class UsersExceptions {
  static Unauthorized() {
    throw new HttpException('Токен истек', HttpStatus.UNAUTHORIZED);
  }

  static UserNotFound() {
    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }
}

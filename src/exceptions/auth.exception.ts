import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException {
  static Unauthorized() {
    return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  static Forbidden() {
    return new HttpException('Доступ запрещён', HttpStatus.FORBIDDEN);
  }

  static WrongPassword() {
    return new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST);
  }

  static WrongCode() {
    return new HttpException('Неверный код доступа', HttpStatus.BAD_REQUEST);
  }
}

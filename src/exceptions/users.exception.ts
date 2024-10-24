import { HttpException, HttpStatus } from '@nestjs/common';

export class UsersException {
  static NotFound() {
    return new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }
}

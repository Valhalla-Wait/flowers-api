import { HttpException, HttpStatus } from '@nestjs/common';

export class TagsException {
  static NotFound() {
    return new HttpException('Тег не найден', HttpStatus.NOT_FOUND);
  }
}

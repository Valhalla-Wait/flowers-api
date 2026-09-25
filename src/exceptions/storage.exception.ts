import { HttpException, HttpStatus } from '@nestjs/common';

export class StorageException {
  static NotFound() {
    return new HttpException('Файл не найден', HttpStatus.NOT_FOUND);
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductsException {
  static NotFound() {
    return new HttpException('Товар не найден', HttpStatus.NOT_FOUND);
  }
}

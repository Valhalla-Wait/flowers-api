import { HttpException, HttpStatus } from '@nestjs/common';

export class CartException {
  static NotFoundInCart() {
    return new HttpException('Товар в корзине не найден', HttpStatus.NOT_FOUND);
  }

  static ProductNotFound() {
    return new HttpException('Товар не найден', HttpStatus.NOT_FOUND);
  }

  static AlreadyInCart() {
    return new HttpException('Данный товар уже добавлен в корзину', HttpStatus.CONFLICT);
  }
}

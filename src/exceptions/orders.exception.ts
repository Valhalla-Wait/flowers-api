import { HttpException, HttpStatus } from '@nestjs/common';

export class OrdersException {
  static NotFoundInCart() {
    return new HttpException('Указанные товары не найдены в корзине', HttpStatus.NOT_FOUND);
  }

  static CreateOrderError() {
    return new HttpException(
      'Во время создания заказа произошла ошибка. Повторите попытку позже',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  static AcceptOrderError() {
    return new HttpException(
      'Во время принятия заказа произошла ошибка. Попробуйте повторить попытку',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  static CancelOrderError() {
    return new HttpException(
      'Во время отмены заказа произошла ошибка. Попробуйте повторить попытку',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  static CompletedOrderError() {
    return new HttpException(
      'Во время завершения заказа произошла ошибка. Попробуйте повторить попытку',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  static SetDeliveryOrderError() {
    return new HttpException(
      'Во время отправки заказа в статус доставки произошла ошибка. Попробуйте повторить попытку',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  static AddProductsInCartRequired() {
    return new HttpException(
      'Необходимо добавить товары в корзину для оформления заказа',
      HttpStatus.NOT_FOUND,
    );
  }

  static NotEnoughConsumables(productNames: string[]) {
    return new HttpException(
      `На данный момент на складе нет в наличии следующих товаров: ${productNames.join(', ')}. Пожалуйста, выберите другой товар`,
      HttpStatus.NOT_FOUND,
    );
  }

  static ProductCountIsNotAvailable(products: string[]) {
    return new HttpException(
      `Выбранное количество товара превышает доступное количество на складе. Доступно: ${products}`,
      HttpStatus.CONFLICT,
    );
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class ConsumablesException {
  static NotFound() {
    return new HttpException('Расходник не найден', HttpStatus.NOT_FOUND);
  }
}

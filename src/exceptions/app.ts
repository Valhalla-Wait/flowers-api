import { HttpException, HttpStatus } from '@nestjs/common';

export class AppExceptions {
  static NoReleaseInfo() {
    throw new HttpException('Отсутствует информация о релизе', HttpStatus.NOT_FOUND);
  }
}

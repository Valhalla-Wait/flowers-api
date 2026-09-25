import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException {
  static Unauthorized() {
    return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  static Forbidden() {
    return new HttpException('Доступ запрещён', HttpStatus.FORBIDDEN);
  }

  static WrongPhoneOrPassword() {
    return new HttpException('Неверный номер телефона или пароль', HttpStatus.BAD_REQUEST);
  }

  static WrongCode() {
    return new HttpException('Неверный код доступа', HttpStatus.BAD_REQUEST);
  }

  static UserWithPhoneAlreadyExist() {
    return new HttpException(
      'Пользователь с таким номером телефона уже зарегистрирован',
      HttpStatus.CONFLICT,
    );
  }

  static RegisterUserError() {
    return new HttpException(
      'Ошибка при регистрации пользователя. Пожалуйста, попробуйте позже',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  static UniversalAuthError() {
    return new HttpException(
      'Не удалось войти по данному номеру',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

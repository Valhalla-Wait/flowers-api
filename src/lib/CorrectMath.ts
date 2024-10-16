class CorrectMath {
  static prepare(value: number, d = 2) {
    const multiplier = Math.pow(10, d);
    return Math.round(value * multiplier);
  }

  static out(value: number, d = 2) {
    const divider = Math.pow(10, d);
    return value / divider;
  }

  //
  //
  //

  static addition(value1: number, value2: number) {
    return CorrectMath.out(CorrectMath.prepare(value1) + CorrectMath.prepare(value2));
  }

  static subtraction(value1: number, value2: number) {
    return CorrectMath.out(CorrectMath.prepare(value1) - CorrectMath.prepare(value2));
  }

  static division(value1: number, value2: number, p = 2) {
    return CorrectMath.multiplication(value1, 1 / value2, p);
  }

  static multiplication(value1: number, value2: number, p = 2) {
    const precision = Math.pow(10, p);
    const wholeAmount = value1 * precision;
    const result = Math.round(wholeAmount * value2);
    return result / precision;
  }

  //
  //
  //

  // NOTE: Процент от суммы
  static percentOfSum(sum: number, percent: number) {
    return CorrectMath.multiplication(sum, CorrectMath.division(percent, 100));
  }

  // NOTE: Остаток суммы с вычитом процентов
  static percentageBalanceValue(sum: number, percent: number) {
    return CorrectMath.multiplication(
      CorrectMath.division(sum, 100),
      CorrectMath.subtraction(100, percent),
    );
  }
}

export default CorrectMath;

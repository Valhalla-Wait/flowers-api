import CorrectMath from '@/lib/CorrectMath';

describe('CorrectMath', () => {
  describe('CorrectMath.division', () => {
    it('Natural numbers', () => {
      const result = 17;
      expect(CorrectMath.division(51, 3)).toBe(result);
    });

    it('Fractional numbers', () => {
      const result = 0.17;

      expect(0.051 / 3).not.toBe(result);
      expect(CorrectMath.division(0.51, 3)).toBe(result);
    });
  });

  describe('CorrectMath.multiplication', () => {
    it('Natural numbers', () => {
      const result = 51;
      expect(CorrectMath.multiplication(3, 17)).toBe(result);
    });

    it('Fractional numbers', () => {
      const result = 0.051;

      expect(0.3 * 0.17).not.toBe(result);
      expect(CorrectMath.multiplication(0.3, 0.17, 3)).toBe(result);
    });
  });

  describe('CorrectMath.subtraction', () => {
    it('Natural numbers', () => {
      const result = 14;
      expect(CorrectMath.subtraction(17, 3)).toBe(result);
    });

    it('Fractional numbers', () => {
      const result = 0.1;

      expect(0.3 - 0.2).not.toBe(result);
      expect(CorrectMath.subtraction(0.3, 0.2)).toBe(result);
    });
  });

  describe('CorrectMath.addition', () => {
    it('Natural numbers', () => {
      const result = 20;
      expect(CorrectMath.addition(17, 3)).toBe(result);
    });

    it('Fractional numbers', () => {
      const result = 0.3;

      expect(0.1 + 0.2).not.toBe(result);
      expect(CorrectMath.addition(0.1, 0.2)).toBe(result);
    });

    it('Fractional numbers (difficult)', () => {
      const a = { price: 0.69, amount: 10 };
      const b = { price: 5.99, amount: 20 };

      const resultA = 6.9;
      const resultB = 119.8;
      const result = 126.7;

      expect(a.amount * a.price).not.toBe(resultA);
      expect(CorrectMath.multiplication(a.amount, a.price)).toBe(resultA);

      expect(b.amount * b.price).not.toBe(resultB);
      expect(CorrectMath.multiplication(b.amount, b.price)).toBe(resultB);

      expect(a.amount * a.price + b.amount * b.price).not.toBe(result);
      expect(
        CorrectMath.addition(
          CorrectMath.multiplication(a.amount, a.price),
          CorrectMath.multiplication(b.amount, b.price),
        ),
      ).toBe(result);
    });
  });
});

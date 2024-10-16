import Dater from '@/lib/Dater';

const a = new Date('2024-01-28T20:59:59.999Z').getTime(); // Sunday
const b = new Date('2024-01-28T21:00:00.000Z').getTime(); // Monday

const c = new Date('2024-02-23T20:00:00.000Z').getTime(); // Holiday
const d = new Date('2024-03-08T20:00:00.000Z').getTime(); // Holiday
const e = new Date('2024-01-27T20:59:59.999Z').getTime(); // Saturday

describe('Dater', () => {
  it('Dater.prepareToMoscowDate', () => {
    expect(Dater.formatToMoscowDate(a)).toBe('28.01.2024');
    expect(Dater.formatToMoscowDate(b)).toBe('29.01.2024');
  });

  it('Dater.getMoscowTimeStamp', () => {
    expect(Dater.getMoscowTimeStamp('01.02.2024')).toBe(1706734800000);
    expect(Dater.getMoscowTimeStamp('11.02.2024')).toBe(1707598800000);
    expect(Dater.getMoscowTimeStamp('21.02.2024')).toBe(1708462800000);
    expect(Dater.getMoscowTimeStamp('29.02.2024')).toBe(1709154000000);
  });

  it('Dater.isEqualDays', () => {
    expect(Dater.isEqualDays(a, b)).toBeFalsy();
    expect(Dater.isEqualDays(b, a)).toBeFalsy();
    expect(Dater.isEqualDays(a, a)).toBeTruthy();
    expect(Dater.isEqualDays(b, b)).toBeTruthy();
  });

  it('Dater.isAfterDay', () => {
    expect(Dater.isAfterDay(a, a)).toBeFalsy();
    expect(Dater.isAfterDay(b, b)).toBeFalsy();
    expect(Dater.isAfterDay(a, b)).toBeFalsy();
    expect(Dater.isAfterDay(b, a)).toBeTruthy();
  });

  it('Dater.isBeforeDay', () => {
    expect(Dater.isBeforeDay(a, a)).toBeFalsy();
    expect(Dater.isBeforeDay(b, b)).toBeFalsy();
    expect(Dater.isBeforeDay(b, a)).toBeFalsy();
    expect(Dater.isBeforeDay(a, b)).toBeTruthy();
  });

  it('Dater.isWeekendDay', () => {
    expect(Dater.isWeekendDay(b)).toBeFalsy();
    expect(Dater.isWeekendDay(a)).toBeTruthy();

    expect(Dater.isWeekendDay(c)).toBeTruthy();
    expect(Dater.isWeekendDay(d)).toBeTruthy();
    expect(Dater.isWeekendDay(e)).toBeTruthy();
  });
});

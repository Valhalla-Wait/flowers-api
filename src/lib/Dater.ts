import * as dayjs from 'dayjs';

import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// example 1707738313447
type Timestamp = number;

// example 1707696000
type IncomingUnixTimestamp = number;

const DATE_FORMAT = 'DD.MM.YYYY';

//
// NOTE:
// всю работу строим на timestamp в миллисекундах
// входящие данные преобразуем к нашему timestamp через Dater.prepareIncomingDate
//

class Dater {
  prepareIncomingDate(value: IncomingUnixTimestamp) {
    return value * 1000;
  }

  getMoscowDate(date: string | number | Date = new Date()) {
    if (typeof date === 'string') {
      return dayjs.tz(date, DATE_FORMAT, 'Europe/Moscow');
    }

    return dayjs.tz(date, 'Europe/Moscow');
  }

  getMoscowTimeStamp(date: string | number | Date = new Date()) {
    return this.getMoscowDate(date).unix() * 1000;
  }

  isWeekendDay(date: Timestamp) {
    return [
      this.getMoscowDate(date).day() % 6 === 0,
      this.formatToMoscowDate(date) === '23.02.2024',
      this.formatToMoscowDate(date) === '08.03.2024',
    ].some(Boolean);
  }

  getNow() {
    return this.formatToMoscowDate(new Date());
  }

  formatToMoscowDate(date: string | number | Date) {
    return this.getMoscowDate(date).format(DATE_FORMAT);
  }

  isEqualDays(a: Timestamp, b: Timestamp) {
    return dayjs(a).isSame(b, 'day');
  }

  isAfterDay(a: Timestamp, b: Timestamp) {
    return dayjs(a).isAfter(b, 'day');
  }

  isBeforeDay(a: Timestamp, b: Timestamp) {
    return dayjs(a).isBefore(b, 'day');
  }
}

export default new Dater();

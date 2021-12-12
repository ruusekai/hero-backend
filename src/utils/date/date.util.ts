import * as moment from 'moment';

export class DateUtil {
  addSeconds(timestamp: number, second: number): Date {
    return moment(timestamp).add(second, 'second').toDate();
  }

  addMinutes(timestamp: number, min: number): Date {
    return moment(timestamp).add(min, 'minute').toDate();
  }

  addHours(timestamp: number, hours: number): Date {
    return moment(timestamp).add(hours, 'hour').toDate();
  }

  subtractDays(timestamp: number, days: number): Date {
    return moment(timestamp).subtract(days, 'days').toDate();
  }

  // set to 12:00am
  getStartOfTime(timestamp: number): Date {
    return moment(timestamp).startOf('day').toDate();
  }

  // use 'x' for milliseconds
  getNumberFromDate(date: Date): number {
    return parseInt(moment(date).format('x'));
  }
}

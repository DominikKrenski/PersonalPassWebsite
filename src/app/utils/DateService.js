/**
 * Module handling all date related tasks
 *
 * @module DateService
 */

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

/**
 * Class that encapsulates logic related to handling dates
 */
class DateService {
  constructor() {}

  /**
   * Returns current timestamp in 'dd/MM/yyyyTHH:mm:ss.SSSZ' format
   *
   * @returns {string} timestamp current UTC timestamp in given format
   */
  getTimestamp() {
    return dayjs().utc().format('D/M/YYYY[T]HH:mm:ss.SSS[Z]');
  }

  /**
   * Converts date to given time zone
   *
   * @param {string} date current date
   * @param {string} timezone timezone identifier
   * @returns {string} date transformed to given time zone
   */
  displayDate(date, timezone) {
    return dayjs(date, 'D/M/YYYY[T]HH:mm:ss.SSS[Z]').tz(timezone).format('D/M/YYYY HH:mm:ss');
  }

  /**
   *
   * @param {string} date date in server format
   * @returns {string} date in format required by application
   */
  convertServerDateToFormDate(date) {
    let splitted = date.split('/');
    splitted = splitted.reverse();
    return splitted.join('-');
  }
}

/**
 * DateService instance
 * @private
 */
const dateService = new DateService();

export default dateService;

/**
 * Module handling all date related tasks
 *
 * @module DateService
 */

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
}

/**
 * DateService instance
 * @private
 */
const dateService = new DateService();

export default dateService;

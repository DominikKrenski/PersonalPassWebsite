/**
 * Contains logic responsible for passing info about user's activity
 *
 * @module TimerService
 */

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Class that encapsulates logic responsible for resetting counter
 */
class TimerService {
  #subject

  /**
   * Constructs TimerService instance
   */
  constructor() {
    this.#subject = new BehaviorSubject(false);
  }

  /**
   * Returns observable to current inactivity state
   *
   * @returns {Obeservable<boolean>} current inactivity state
   */
  getActivity() {
    return this.#subject.asObservable();
  }

  /**
   * Pass inactivity state to all subscribers
   *
   * @param {boolean} flag indicates if there is any user's activity
   */
  activityDetected(flag) {
    this.#subject.next(flag);
  }
}

/**
 * TimerService instance
 *
 * @private
 */
const timerService = new TimerService();

export default timerService;

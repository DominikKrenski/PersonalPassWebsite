/**
 * Contains logic responsible for passing server errors around whole application
 *
 * @module ErrorService
 */

/**
 * Object defining validation error
 *
 * @typedef {Object} ValidationError
 * @property {string} field - validated field's name
 * @property {string|number} rejectedValue - rejected value
 * @property {string[]} validationMessages - validation messages for given field
 */

/**
 * Object defining server error
 *
 * @typedef {Object} ApiError
 * @property {string} status - error response status
 * @property {string} timestamp - date when error occurred
 * @property {string} message - error's description
 * @property {ValidationError[]} errors - optional validation errors
 */

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Class that encapsulates logic responsible for passing errors
 */
class ErrorService {
  #subject

  /**
   * Constructs ErrorService instance
   */
  constructor() {
    this.#subject = new BehaviorSubject(null);
  }

  /**
   * Returns observable to current api error
   *
   * @returns {Observable<ApiError>}
   */
  getError() {
    return this.#subject.asObservable();
  }

  /**
   * Pass new api error to all subscribers
   *
   * @param {ApiError} error error response
   */
  updateError(error) {
    this.#subject.next(error);
  }

  /**
   * Set next emitted value to null to avoid displaying error messages in other components
   */
  clearError() {
    this.#subject.next(null);
  }
}

/**
 * ErrorService instance
 *
 * @private
 */
const errorService = new ErrorService();

export default errorService;

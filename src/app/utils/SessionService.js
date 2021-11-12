/**
 * Contains logic responsible for handling SessionStorage
 * related tasks.
 *
 * @module SessionService
 */

/**
 * Class that encapsulates logic for handling SessionStorage related tasks.
 */
class SessionService {
  #storage = window.sessionStorage; // sessionStorage handler

  constructor() {}

  /**
   * Sets new value in Session Storage
   *
   * @param {string} key the name of the key
   * @param {string} value  the value to be stored
   */
  set(key, value) {
    this.#storage.setItem(key, value);
  }

  /**
   * Retrieves data stored at given key.
   *
   * @param {string} key the name of the key
   * @returns {(string|null)} null if given key does not exists; value otherwise
   */
  get(key) {
    return this.#storage.getItem(key);
  }

  /**
   * The name of the key that sould be removed
   *
   * @param {string} key the name of the key
   */
  remove(key) {
    this.#storage.removeItem(key);
  }

  /**
   * Removes all items from Session Storage
   */
  clear() {
    this.#storage.clear();
  }
}

const sessionService = new SessionService();

export default sessionService;

/**
 * Contains logic responsible for handling LocalStorage
 * related tasks.
 *
 * @module LocalService
 */

/**
 * Class that encapsulates logic for handling LocalStorage related tasks.
 */
class LocalService {
  #storage = window.localStorage; //localStorage handler

  constructor() {}

  /**
   * Sets a new value in Local Storage
   *
   * @param {string} key  the neme of the key
   * @param {string} value the value to be stored
   */
  set(key, value) {
    this.#storage.setItem(key, value);
  }

  /**
   * Retrieves data stored at given key
   *
   * @param {string} key the name of the key
   * @returns {string|null} null if given key does not exist; value otherwise
   */
  get(key) {
    return this.#storage.getItem(key);
  }

  /**
   * Removes entry with given key
   *
   * @param {string} key the name of the key
   */
  remove(key) {
    this.#storage.removeItem(key);
  }

  /**
   * Removes all items from Local Storage
   */
  clear() {
    this.#storage.clear();
  }
}

const localService = new LocalService();

export default localService;

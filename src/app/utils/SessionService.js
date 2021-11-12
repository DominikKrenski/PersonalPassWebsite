class SessionService {
  #storage = window.sessionStorage;

  constructor() {}

  set(key, value) {
    this.#storage.setItem(key, value);
  }

  get(key) {
    return this.#storage.getItem(key);
  }

  remove(key) {
    this.#storage.removeItem(key);
  }

  clear() {
    this.#storage.clear();
  }
}

const sessionService = new SessionService();

export default sessionService;

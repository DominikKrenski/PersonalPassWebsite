const axios = require('axios').default;

class HttpClient {
  #instance

  constructor() {
    this.#instance = axios.create({
      baseURL: process.env.SERVER_URL,
      timeout: 10000,
      withCredentials: false,
      responseType: 'json',
      responseEncoding: 'utf-8',
      maxContentLength: 2000,
      decompress: true
    });
  }

  get(url, opts) {
    return this.#instance.get(url, opts);
  }

  post(url, data, opts) {
    return this.#instance.post(url, data, opts);
  }
}

const httpClient = new HttpClient();

export default httpClient;

const axios = require('axios').default;

class HttpClient {
  #instance

  constructor() {
    this.#instance = axios.create({
      baseURL: process.env.SERVER_URL,
      timeout: 10000,
      withCredentials: true,
      responseType: 'json',
      responseEncoding: 'utf-8',
      maxContentLength: 2000,
      decompress: true
    });
  }

  post(url, data, opts) {
    return this.#instance.post(url, data, opts);
  }
}

const httpClient = new HttpClient();

export default httpClient;

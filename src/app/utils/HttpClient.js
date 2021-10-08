const axios = require('axios').default;

class HttpClient {
  #instance

  constructor() {
    this.#instance = axios.create({
      baseURL: 'https://personal-pass.dev:8443',
      timeout: 10000,
      withCredentials: true,
      responseType: 'json',
      maxContentLength: 2000,
      decompress: true
    });
  }
}

const httpClient = new HttpClient();

export default httpClient;

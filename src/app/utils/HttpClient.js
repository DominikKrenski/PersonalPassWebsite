/**
 * Contains logic responsible for handling HTTP request
 *
 * @module HttpClient
 */


/**
 * Axios instance
 * @private
 */
const axios = require('axios').default;

/**
 * Class that encapsulate logic responsible for handling HTTP requests
 */
class HttpClient {
  #instance

  /**
   * Creates HttpClient instance and sets default request's settings
   */
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

  /**
   * Sends HTTP GET request
   *
   * @param {string} url server's endpoint address
   * @param {object} opts request's configuration
   * @returns {Promise<AxiosResponse<any>>} Promise object representing response
   */
  get(url, opts) {
    return this.#instance.get(url, opts);
  }

  /**
   * Sends HTTP POST request
   *
   * @param {string} url server's endpoint address
   * @param {object} data data to be send
   * @param {object} opts request's configuration
   * @returns {Promise<AxiosResponse<any>>} Promise object representing response
   */
  post(url, data, opts) {
    return this.#instance.post(url, data, opts);
  }
}

/**
 * Creates HttpClient instance
 * @private
 */
const httpClient = new HttpClient();

/**
 * HttpClient instance
 */
export default httpClient;

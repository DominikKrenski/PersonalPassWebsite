/**
 * Contains logic responsible for handling HTTP request
 *
 * @module HttpClient
 */

import accessService from './AccessService';
import dateService from './DateService';
import urls from './urls';
import i18n from '../i18n';

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
  #accessData

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

    accessService.getAccessData().subscribe(data => this.#accessData = data);

    this.#instance.interceptors.request.use(config => {
      const url = config.url;

      if (url === urls.refresh) {
        config.headers.Authorization = `Bearer ${this.#accessData.refreshToken}`;
        return config;
      }

      if (url !== urls.signup && url !== urls.signin && url !== urls.salt && url !== urls.sendHint) {
        config.headers.Authorization = `Bearer ${this.#accessData.accessToken}`;
      }

      return config;
    }, err => {
      console.log('Something happened in setting up the request');
      console.error(err);
      return Promise.reject({
        status: 'Internal Server Error',
        timestamp: dateService.getTimestamp(),
        message: this.#prepareErrorResponse('Something went wrong. Please, try later.')
      });
    });

    this.#instance.interceptors.response.use(undefined, async err => {
      const originalConfig = err.config;

      if (err.response) {
        // server responded with status code falls out of range of 2xx
        if (err.response.status < 500) {
          console.log('Server responded with status code > 2xx but < 5xx');

          if (originalConfig.url !== urls.refresh && err.response.status === 403 && err.response.data.message === 'Access token expired') {
            const refreshRes = await this.get(urls.refresh);
            await accessService.updateTokens(refreshRes.data.accessToken, refreshRes.data.refreshToken, this.#accessData.masterKey);
            return this.#instance(originalConfig);
          }

          // translate error response
          err.response.data.message = this.#prepareErrorResponse(err.response.data.message);

          return Promise.reject(err.response.data);
        } else {
          console.log('Server responded with status code > 500');
          return Promise.reject({
            status: 'Internal Server Error',
            timestamp: err.response.data.timestamp,
            message: this.#prepareErrorResponse('Something went wrong. Please, try later.')
          });
        }
      } else {
        console.log('Request was made but no response was received');
        // request was made but no response was received
        return Promise.reject({
          status: 'Internal Server Error',
          timestamp: dateService.getTimestamp(),
          message: this.#prepareErrorResponse('Something went wrong. Please, try later.')
        })
      }
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

  /**
   *
   * @param {string} url server's endpoint address
   * @param {object} data data to be send
   * @param {object} opts request's configuration
   * @returns {Promise<AxiosResponse<any>>} Promise object representing response
   */
  put(url, data, opts) {
    return this.#instance.put(url, data, opts);
  }

  /**
   *
   * @param {string} url server's endpoint address
   * @param {object} opts request's configuration
   * @returns {Promise<AxiosResponse<any>>} Promise object representing response
   */
  delete(url, opts) {
    return this.#instance.delete(url, opts);
  }

  #prepareErrorResponse(msg) {
    if (i18n.language === 'pl' || i18n.language === 'pl-PL') {
      let message;

      if (msg.includes('Account with given email already exist')) {
        message = 'Istnieje już konto powiązane z danym adresem email';
      } else if (msg.includes('Account does not exist')) {
        message = 'Konto nie istnieje';
      } else if (msg.includes('Email or password invalid')) {
        message = 'Adres email lub hasło nie jest poprawne';
      } else if (msg.includes('Token is invalid')) {
        message = 'Token jest nieprawidłowy';
      } else if (msg.includes('Security Exception. Server detected that the same token has been used again')) {
        message = 'Wyjątek bezpieczeństwa. Serwer wykrył, że ten sam token został wykorzystany ponownie'
      } else {
        message = 'Coś poszło nie tak. Spróbuj ponownie później'
      }

      return message;
    }

    return msg;
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

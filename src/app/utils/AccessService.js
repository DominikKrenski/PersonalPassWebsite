/**
 * Module handling all tasks related with storing access and refresh
 * tokens along with master key in raw format
 *
 * @module AccessService
 */

/**
 * Object defining data stored in this service
 * @typedef {Object} AccessData
 * @property {string} accessToken - decrypted access token
 * @property {string} refreshToken - decrypted refresh token
 * @property {Uint8Array} masterKey - decrypted master key
 */

import { BehaviorSubject, Observable } from 'rxjs';

import dbService from './DatabaseService';
import sessionService from './SessionService';
import encryptionService from './EncryptionService';

class AccessService {
  #subject;

  constructor() {
    this.#subject = new BehaviorSubject(null);
  }

  /**
   * Returns observable to AccessData
   *
   * @returns {Observable<AccessData>} data to handle all
   * encryption and backend access related tasks
   */
  getAccessData() {
    return this.#subject.asObservable();
  }

  /**
   * Updated access data
   *
   * @param {AccessData} accessData updated access data
   */
  updateAccessData(updatedData) {
    let currentData = this.#subject.getValue();

    if (currentData) {
      Object.assign(currentData, updatedData);
      this.#subject.next(currentData);
    } else {
      this.#subject.next(updatedData);
    }
  }

  /**
   * Set access data to null
   */
  clearAccessData() {
    this.#subject.next(null);
  }

  /**
   * Encrypts and stores all tokens and derivation key
   * in SessionStorage and IndexedDB
   *
   * @param {string} accountId account's public id
   * @param {string} accessToken access token from server
   * @param {string} refreshToken refresh token from server
   * @param {Uint8Array} derivationKey derivation key stored as raw bytes array
   */
  async saveAccessData(accountId, accessToken, refreshToken, derivationKey) {
    // clear all data from session storage
    sessionService.clear();

    // save account id is session storage
    sessionService.set('account_id', accountId);

    // encrypt derivation key
    const encryptedMaster = await encryptionService.encryptMasterKey(derivationKey, process.env.PRIVATE_KEY);

    // encrypt access token
    const encryptedAccessToken = await encryptionService.encryptData(accessToken, derivationKey);

    // encrypt refresh token
    const encryptedRefreshToken = await encryptionService.encryptData(refreshToken, derivationKey);

    // save derivation key's access token's and refresh token's vector in session storage
    sessionService.set('private_vector', encryptedMaster.vector);
    sessionService.set('access_vector', encryptedAccessToken.vector);
    sessionService.set('refresh_vector', encryptedRefreshToken.vector);

    // save encrypted master key, access token and refresh token in IndexedDB
    await dbService.accounts.put({
      account_id: accountId,
      master_key: encryptedMaster.masterKey,
      access_token: encryptedAccessToken.encryptedData,
      refresh_token: encryptedRefreshToken.encryptedData
    });
  }

  /**
   * Decrypts master key, access and refresh token and pass them to all subscribers
   */
  async passAccessData() {
    // get refresh_vector HEX from SessionStorage
    const refreshVectorHEX = sessionService.get('refresh_vector');

    // get access_vector HEX from SessionStorage
    const accessVectorHEX = sessionService.get('access_vector');

    // get private_vector HEX from SessionStorage (vector used to encrypt master key)
    const privateVectorHEX = sessionService.get('private_vector');

    // get account_id from SessionStorage
    const accountId = sessionService.get('account_id');

    // check if all of above constants are not null
    if (!(refreshVectorHEX && accessVectorHEX && privateVectorHEX && accountId)) {
      throw new Error('One of required constants is missing');
    }

    // get encrypted master key in HEX format from IndexedDB
    const account = await dbService.accounts.where('account_id').equals(accountId).first();

    // decrypt master key to Unit8Array
    const masterKey = await encryptionService.decryptMasterKey(account['master_key'], process.env.PRIVATE_KEY, privateVectorHEX);

    // decrypt access token
    const accessToken = await encryptionService.decryptData(account['access_token'], accessVectorHEX, masterKey);

    // decrypt refresh token
    const refreshToken = await encryptionService.decryptData(account['refresh_token'], refreshVectorHEX, masterKey);

    // pass descoded stuff to other components
    this.#subject.next({
      masterKey: masterKey,
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  }

  /**
   * Gets access and refresh tokens generated by the server, encrypts them with master key,
   * saves in Session Storage and IndexedDB and pass them to other component at the very end.
   *
   * @param {string} accessToken new access token
   * @param {string} refreshToken new refresh token
   * @param {Uint8Array} masterKeyRaw application's master key
   */
  async updateTokens(accessToken, refreshToken, masterKeyRaw) {
    const accountId = sessionService.get('account_id');

    if (!accountId) {
      throw new Error('Account id is not set');
    }

    // encrypt access token
    const encryptedAccessToken = await encryptionService.encryptData(accessToken, masterKeyRaw);

    // encrypt refresh token
    const encryptedRefreshToken = await encryptionService.encryptData(refreshToken, masterKeyRaw);

    // save access and refresh token's in Session Storage
    sessionService.set('access_vector', encryptedAccessToken.vector);
    sessionService.set('refresh_vector', encryptedRefreshToken.vector);

    // save tokens in database
    await dbService.accounts.update(accountId, {
      'access_token': encryptedAccessToken.encryptedData,
      'refresh_token': encryptedRefreshToken.encryptedData
    });

    this.#subject.next({
      masterKey: masterKeyRaw,
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  }

  async deleteAllAccessData() {
    await dbService.accounts.where('account_id').equals(sessionService.get('account_id')).delete();

    sessionService.remove('refresh_vector');
    sessionService.remove('private_vector');
    sessionService.remove('account_id');
    sessionService.remove('access_vector');

    this.#subject.next(null);
  }

}

/**
 * AccessService instance
 *
 * @private
 */
const accessService = new AccessService();

export default accessService;

/**
 * Module handling all encryption related tasks
 *
 * @module EncryptionService
 */

/**
 * Object defining result of master key encryption
 *
 * @typedef {Object} MasterKeyEncryption
 * @property {string} vector - initialization vector in HEX format
 * @property {string} masterKey - encrypted master key in HEX format
 */

/**
 * Object defining result of generating derivation key for new password
 *
 * @typedef {Object} UpdatePasswordData
 * @property {TypedArray} derivationKey - derivation key in byte format
 * @property {string} derivationKeyHash - double SHA-256 hash of derivation key in HEX format
 * @property {string} salt - salt in HEX format
 */

/**
 * Object defining result of data encryption
 *
 * @typedef {Object} DataEncryption
 * @property {string} vector - initialization vector in HEX format
 * @property {string} encryptedData - encrypted data in HEX format
 */

/**
 * Object describing registration data
 *
 * @typedef {Object} InputRegistrationData
 * @property {string} email - user's email
 * @property {string} password - user's password
 * @property {string} reminder - password reminder
 */

/**
 * Object describing prepared registration data
 *
 * @typedef {Object} OutputRegistrationData
 * @property {string} email - user's email
 * @property {string} password - double hashed user's password in HEX format
 * @property {string} salt - salt used to derive bits from password in HEX format
 * @property {string} reminder - password reminder
 */

/**
 * Object describing prepared login data
 *
 * @typedef {Object} LoginData
 * @property {string} email - user's email
 * @property {string} password - double hashed derivation key generated from user's password
 */

/**
 * Class containing methods for encrypting/decrypting data
 */
class EncryptionService {

  /**
   * Converts string into Uint8Array
   *
   * @param {string} data data to be converted
   * @returns {Uint8Array} array representation of input string
   */
  #convertStringIntoUint8Array(data) {
    const encoder = new TextEncoder();
    return encoder.encode(data);
  }

  /**
   * Converts Uint8Array to HEX string
   *
   * @param {Uint8Array} input array of bytes
   * @returns {string} HEX-encoded string
   */
  #convertTypedArrayIntoHex(input) {
    const arr = new Uint8Array(input);
    const tmp = [];

    arr.forEach(el => {
      tmp.push(el.toString(16).padStart(2, '0'))
    });

    return tmp.join('');
  }

  /**
   * Checks if given string is valid HEX
   *
   * @param {string} hex HEX string to validate
   * @returns {boolean} true if HEX is valid; false otherwise
   */
  #checkHexString(hex) {
    let flag = true;

    if (hex.length % 2 !== 0) {
      flag = false;
    }

    if (!/[0-9A-F]/i.test(hex)) {
      flag = false;
    }

    return flag;
  }

  /**
   * Converts HEX-encoded string to Uint8Array
   *
   * @param {string} hex HEX-encoded string
   * @returns {Uint8Array} array representation of given HEX-encoded string
   * @throws Throws an error if data is not valid HEX string
   */
  #convertHexIntoTypedArray(hex) {
    if (hex.length % 2 !== 0) {
      throw new Error('HEX string has invalid number of characters');
    }

    if (!/[0-9A-F]/i.test(hex)) {
      throw new Error('Not valid HEX');
    }

    // split string into 2 char pairs
    const pairs = hex.match(/[0-9A-F]{2}/ig);

    // convert each pair into corresponing UINT_16
    const ints = pairs.map(el => parseInt(el, 16));

    return new Uint8Array(ints);
  }

  /**
   * Generates Uint8Array given length
   *
   * @param {number} length number of bytes to generate
   * @returns {Uint8Array} array filled with random bytes
   */
  #generateRandomValues(length) {
    const values = new Uint8Array(length);
    return window.crypto.getRandomValues(values);
  }

  /**
   * Converts UTF-16 string into CryptoKey that can be used to generate derivatation key with PBKDF2 algorithm.
   *
   * @param {string} str string to be coverted into CryptoKey
   * @returns {Promise<Uint8Array>} Promise object representing CryptoKey
   * @throws {SyntaxError} raised when `keyUsages is empty but the unwrapped key is of type `secret` or `private`
   * @throws {TypeError} raised when trying to use an invalid format or if the `keyData` is not suited for that format
   */
  async #importPbkdfKey(str) {
    const keyData = this.#convertStringIntoUint8Array(str);

    return window.crypto.subtle.importKey(
      'raw',
      keyData,
      'PBKDF2',
      false,
      ['deriveKey', 'deriveBits']
    );
  }

  /**
   * Converts Uint8Array into CryptoKey that can be used to encrypt/decrypt text with AES-GCM algorithm
   *
   * @param {Uint8Array} keyBytes key stored as raw byte array
   * @returns {Promise<Uint8Array>} Promise object representing CryptoKey
   * @throws {SyntaxError} raised when `keyUsages` is empty but the unwrapped key is of type `secret` or `private`
   * @throws {TypeError} raised when trying to use an invalid format or if the `keyData` is not suited for that format
   */
  async #importAesKey(keyBytes) {
    return window.crypto.subtle.importKey(
      'raw',
      keyBytes,
      {
        'name': 'AES-GCM'
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Derives bits from given key.
   *
   * @param {string} data Key's string representation
   * @param {Uint8Array} salt array containing salt used during processing
   * @returns {Promise<Uint8Array>} Promise object representing derived bits
   */
  async #generateDerivationKey(data, salt) {
    const key = await this.#importPbkdfKey(data);

    return window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: salt,
        iterations: 100100
      },
      key,
      256
    );
  }

  /**
   * Computes double SHA-256 hash from given input array
   *
   * @param {Uint8Array} derivationKey input array
   * @returns {Promise<Uint8Array>} Promise object representing  computed hash
   */
  async #generateDerivationKeyHash(derivationKey) {
    const firstHash = await window.crypto.subtle.digest('SHA-256', derivationKey);
    const secondHash = await window.crypto.subtle.digest('SHA-256', firstHash);
    return secondHash;
  }

  /**
   * Encrypt data with AES-GCM SHA-256 algorithm
   *
   * @param {string} data text to be encrypted
   * @param {Uint8Array} masterKeyBytes array of bytes representing encryption key
   * @returns {Promise<Uint8Array>} Promise object representing encrypted text {@link DataEncryption}
   * @throws {InvalidAccessError} raised when the requested operation is not valid for the provided key
   * (invalid encryption algorithm, or invalid key for the specified encryption algorithm)
   * @throws {OperationError} raised when operation failed for an operation specific reason (algorithm parameters
   * of invalid sized, or AES-GCM plaintext logner than 2^39 - 256 bytes)
   */
  async encryptData(data, masterKeyBytes) {
    const dataUint8Array = this.#convertStringIntoUint8Array(data);
    const vector = this.#generateRandomValues(12);
    const cryptoKey = await this.#importAesKey(masterKeyBytes);

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: vector
      },
      cryptoKey,
      dataUint8Array
    );

    return {
      encryptedData: this.#convertTypedArrayIntoHex(encrypted),
      vector: this.#convertTypedArrayIntoHex(vector)
    }
  }

  /**
   * Decrypt AES-GCM data encoded as HEX string
   *
   * @param {string} encryptedDataHEX HEX-encoded encrypted data
   * @param {string} vectorHEX HEX-encoded initialization vector
   * @param {Uint8Array} masterKeyRaw byte array containing encryption key
   * @returns {Promise<string>} Promise object representing decrypted text
   * @throws {InvalidAccessError} raised when the requested operation is not valid for the provided key
   * (invalid encryption algorithm, or invalid key for the specified encryption algorithm)
   * @throws {OperationError} raised when operation failed for an operation specific reason (algorithm parameters
   * of invalid sized, or AES-GCM plaintext logner than 2^39 - 256 bytes)
   */
  async decryptData(encryptedDataHEX, vectorHEX, masterKeyRaw) {
    if (!this.#checkHexString(encryptedDataHEX)) {
      throw new Error('Encrypted data is not valid HEX string');
    }

    if (!this.#checkHexString(vectorHEX)) {
      throw new Error('Vector is not valid HEX string');
    }

    const encryptedDataRaw = this.#convertHexIntoTypedArray(encryptedDataHEX);
    const vectorRaw = this.#convertHexIntoTypedArray(vectorHEX);
    const cryptoKey = await this.#importAesKey(masterKeyRaw);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: vectorRaw
      },
      cryptoKey,
      encryptedDataRaw
    );

    return new TextDecoder().decode(decrypted);
  }

  /**
   * Encrypts master key with AES-GCM SHA-256 algorithm
   *
   * @param {Uint8Array} masterKeyBytes byte array representing master key
   * @param {string} encryptionKeyHEX application's encryption key stored in HEX format
   * @returns {Promise<Uint8Array>} Promise object representing encrypted master key {@link MasterKeyEncryption}
   * @throws {InvalidAccessError} raised when the requested operation is not valid for the provided key
   * (invalid encryption algorithm, or invalid key for the specified encryption algorithm)
   * @throws {OperationError} raised when operation failed for an operation specific reason (algorithm parameters
   * of invalid sized, or AES-GCM plaintext logner than 2^39 - 256 bytes)
   */
  async encryptMasterKey(masterKeyBytes, encryptionKeyHEX) {
    const encryptionKeyRaw = this.#convertHexIntoTypedArray(encryptionKeyHEX);
    const vector = this.#generateRandomValues(12);
    const cryptoKey = await this.#importAesKey(encryptionKeyRaw);

    const encryptedMasterKey = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: vector
      },
      cryptoKey,
      masterKeyBytes
    );

    return {
      vector: this.#convertTypedArrayIntoHex(vector),
      masterKey: this.#convertTypedArrayIntoHex(encryptedMasterKey)
    }
  }

  /**
   * Decrypts master key
   *
   * @param {string} masterKeyHEX encrypted master key in HEX format
   * @param {string} encryptionKeyHEX application's encryption key in HEX format
   * @param {string} vectorHEX application's initialization vector in HEX format
   * @returns {Promise<Uint8Array>} Promise object representing dedcrypted master key as Uint8Array
   * @throws {InvalidAccessError} raised when the requested operation is not valid for the provided key
   * (invalid encryption algorithm, or invalid key for the specified encryption algorithm)
   * @throws {OperationError} raised when operation failed for an operation specific reason (algorithm parameters
   * of invalid sized, or AES-GCM plaintext logner than 2^39 - 256 bytes)
   */
  async decryptMasterKey(masterKeyHEX, encryptionKeyHEX, vectorHEX) {
    const masterKeyRaw = this.#convertHexIntoTypedArray(masterKeyHEX);
    const encryptionKeyRaw = this.#convertHexIntoTypedArray(encryptionKeyHEX);
    const vector = this.#convertHexIntoTypedArray(vectorHEX);
    const cryptoKey = await this.#importAesKey(encryptionKeyRaw);

    return window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: vector
      },
      cryptoKey,
      masterKeyRaw
    );
  }

  /**
   * Regenerates derivation key from password and salt in HEX format
   *
   * @param {string} password plain password
   * @param {string} saltHex salt in HEX format
   * @returns {Promise<Uint8Array>} Promise object representing regenerated derivation key
   */
  async regenerateDerivationKey(password, saltHex) {
    if (!this.#checkHexString(saltHex)) {
      throw new Error('Salt is not valid HEX string');
    }

    const salt = this.#convertHexIntoTypedArray(saltHex);
    const key = await this.#importPbkdfKey(password);

    return window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: salt,
        iterations: 100100
      },
      key,
      256
    );
  }

  /**
   * Prepare data for password update process
   *
   * @param {string} password password to derive bits from
   * @returns
   */
  async prepareUpdatePasswordData(password) {
    const salt = this.#generateRandomValues(16);
    const derivationKey = await this.#generateDerivationKey(password, salt);
    const derivationKeyHash = await this.#generateDerivationKeyHash(derivationKey);

    return {
      derivationKey: derivationKey,
      derivationKeyHash: this.#convertTypedArrayIntoHex(derivationKeyHash),
      salt: this.#convertTypedArrayIntoHex(salt)
    }
  }

  /**
   * Prepare data for registration process
   *
   * @param {InputRegistrationData} data registration data
   * @returns {OutputRegistrationData} registration data after encoding {@link OutputRegistrationData}
   */
  async prepareRegistrationData(data) {
    const {email, password, reminder} = data;

    const salt = this.#generateRandomValues(16);
    const derivationKey = await this.#generateDerivationKey(password, salt);
    const derivationKeyHash = await this.#generateDerivationKeyHash(derivationKey);

    const registrationData = {
      email: email,
      password: this.#convertTypedArrayIntoHex(derivationKeyHash),
      salt: this.#convertTypedArrayIntoHex(salt)
    };

    if (reminder && reminder.trim().length > 0) {
      registrationData.reminder = reminder.trim();
    }

    return registrationData;
  }

  /**
   *
   * @param {string} email user's email
   * @param {Uint8Array} derivationKey derivation key
   * @returns {LoginData} login data after encoding {@link LoginData}
   */
  async prepareLoginData(email, derivationKey) {
    const derivationKeyHash = await this.#generateDerivationKeyHash(derivationKey);

    return {
      email: email,
      password: this.#convertTypedArrayIntoHex(derivationKeyHash)
    }
  }

  /**
   * Converts Base64-encoded text into UTF-16 text
   *
   * @param {string} data Base64-encoded text
   * @returns {string} UTF-16 text
   */
  convertBase64ToString(data) {
    return decodeURIComponent(escape(window.atob(data)));
  }

  /**
   * Compares two master keys
   *
   * @param {ArrayBuffer} oldKey old master key
   * @param {ArrayBuffer} newKey new master key
   * @returns true if keys are equal; false otherwise
   */
  compareMasterKeys(oldKey, newKey) {
    const oldArray = new Uint8Array(oldKey);
    const newArray = new Uint8Array(newKey);

    return oldArray.every((el, idx) => el === newArray[idx]);
  }
}

const encryptionService = new EncryptionService();

export default encryptionService;

class EncryptionService {
  #convertStringIntoUint8Array(data) {
    const encoder = new TextEncoder();
    return encoder.encode(data);
  }

  #convertTypedArrayIntoHex(input) {
    const arr = new Uint8Array(input);
    const tmp = [];

    arr.forEach(el => {
      tmp.push(el.toString(16).padStart(2, '0'))
    });

    return tmp.join('');
  }

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

  #generateRandomValues(length) {
    const values = new Uint8Array(length);
    return window.crypto.getRandomValues(values);
  }

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

  async #generateDerivationKeyHash(derivationKey) {
    const firstHash = await window.crypto.subtle.digest('SHA-256', derivationKey);
    const secondHash = await window.crypto.subtle.digest('SHA-256', firstHash);
    return secondHash;
  }

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

  async decryptData(encryptedDataHEX, vectorHEX, masterKeyRaw) {
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

  async regenerateDerivationKey(password, saltHex) {
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

  async prepareLoginData(email, derivationKey) {
    const derivationKeyHash = await this.#generateDerivationKeyHash(derivationKey);

    return {
      email: email,
      password: this.#convertTypedArrayIntoHex(derivationKeyHash)
    }
  }

  convertBase64ToString(data) {
    return decodeURIComponent(escape(window.atob(data)));
  }
}

const encryptionService = new EncryptionService();

export default encryptionService;

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

  #converHexIntoTypedArray(hex) {
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

  async #importKey(str) {
    const keyData = this.#convertStringIntoUint8Array(str);

    return window.crypto.subtle.importKey(
      'raw',
      keyData,
      'PBKDF2',
      false,
      ['deriveKey', 'deriveBits']
    );
  }

  async #generateDerivationKey(data, salt) {
    const key = await this.#importKey(data);

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

  async regenerateDerivationKey(password, saltHex) {
    const salt = this.#converHexIntoTypedArray(saltHex);
    const key = await this.#importKey(password);

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

  #generateRandomValues(length) {
    const values = new Uint8Array(length);
    return window.crypto.getRandomValues(values);
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
      password: derivationKeyHash
    }
  }
}

const encryptionService = new EncryptionService();

export default encryptionService;

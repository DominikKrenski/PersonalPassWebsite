export const convertStringIntoUint8Array = data => {
  const encoder = new TextEncoder();
  return encoder.encode(data);
}

export const convertTypedArrayIntoHex = input => {
  const arr = new Uint8Array(input);
  const tmp = [];

  arr.forEach(el => {
    tmp.push(el.toString(16).padStart(2, '0'))
  });

  return tmp.join('');
}

export const convertHexIntoTypedArray = hex => {
  if (hex.length % 2 !== 0) {
    throw new Error('String has invalid number of characters');
  }

  if (!/[0-9A-F]/i.test(hex)) {
    throw new Error('Not valid HEX');
  }

  // split string into 2-char pairs
  const pairs = hex.match(/[0-9A-F]{2}/ig);

  // convert each pair into corresponding UINT_16
  const ints = pairs.map(el => parseInt(el, 16));

  return new Uint8Array(ints);
}

export const importKey = async str => {
  const keyData = convertStringIntoUint8Array(str);

  return window.crypto.subtle.importKey(
    'raw',
    keyData,
    'PBKDF2',
    false,
    ['deriveKey', 'deriveBits']
  );
}

export const generateDerivationKey = async (password, salt) => {
  const key = await importKey(password);

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

export const regenerateDerivationKey = async (password, saltHex) => {
  const salt = convertHexIntoTypedArray(saltHex);
  const key = await importKey(password);

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

export const generateDerivationKeyHash = async derivationKey => {
  const firstHash = await window.crypto.subtle.digest('SHA-256', derivationKey);
  const secondHash = await window.crypto.subtle.digest('SHA-256', firstHash);

  return secondHash;
}

export const generateRandomValues = length => {
  const values = new Uint8Array(length);
  return window.crypto.getRandomValues(values);
}

export const prepareRegistrationData = async data => {
  const { email, password, reminder } = data;

  const salt = generateRandomValues(16);
  const derivationKey = await generateDerivationKey(password, salt);
  const derivationKeyHash = await generateDerivationKeyHash(derivationKey);

  const registrationData = {
    email: email,
    password: convertTypedArrayIntoHex(derivationKeyHash),
    salt: convertTypedArrayIntoHex(salt)
  }

  if (reminder && reminder.trim().length > 0) {
    registrationData.reminder = reminder.trim();
  }

  return registrationData;
}

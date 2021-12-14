/**
 * Contains all custom validators used in application.
 * @module validators
 */

/**
 * Checks if text is not falsy and has length greater than 0
 *
 * @function
 * @param {string} value text to be validated
 * @returns {(null|string)} null if value meets the conditions, error message otherwise
 */
export const requiredValidator = value => {
  if (value && value.trim().length > 0) {
    return null;
  }

  return 'Field is required';
}

/**
 * Checks if text is valid email.
 *
 * @function
 * @param {string} value text to be validated
 * @returns {(null|string)} null if value matches email pattern, error message otherwise
 */
export const emailValidator = value => {
  const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(value) ? null : 'Email is not valid';
}

/**
 * Checks if the length of the text is greater than or equat the provided minimum length
 *
 * @function
 * @param {string} value text to be validated
 * @param {number} minLength minimum length
 * @returns {(null|number)} null if text has a minimum length, min length otherwise
 */
export const minLengthValidator = (value, minLength) => {
  if(value && value.length >= minLength) {
    return null;
  }

  return minLength;
}

/**
 * Checks if the length of the text is less than or equal to the provided maximum length.
 *
 * @function
 * @param {string} value text to be validated
 * @param {number} maxLength maximum length
 * @returns {(null|number)} null if text is no longer than maximum length, max length otherwise
 */
export const maxLengthValidator = (value, maxLength) => {
  if (!value || value.length <= maxLength) {
    return null;
  }

  return maxLength;
}

/**
 * Checks if given text contains at least one digit.
 *
 * @function
 * @param {string} value text to be validated
 * @returns {(null|string)} null if text meets the condition; error message otherwise
 */
export const atLeastOneDigitValidator = value => {
  const regex = /^.*[0-9].*$/;

  if (value && regex.test(value)) {
    return null;
  }

  return 'Field must contain at least one digit';
}

/**
 * Checks if given text contains at least one lowercase letter.
 *
 * @function
 * @param {string} value text to be validated
 * @returns {(null|string)} null if text meets the condition; error message otherwise
 */
export const atLeastOneLowercaseValidator = value => {
  const regex = /^.*[a-zęóąśłżźćń].*$/;

  if (value && regex.test(value)) {
    return null;
  }

  return 'Field must contain at least one lower-case letter';
}

/**
 * Checks if given text contains at least one uppercase letter.
 *
 * @function
 * @param {string} value text to be validated
 * @returns {(null|string)} null if text meets the condition; error message otherwise
 */
export const atLeastOneUppercaseValidator = value => {
  const regex = /^.*[A-ZĘÓĄŚŁŻŹĆŃ].*$/;

  if (value && regex.test(value)) {
    return null;
  }

  return 'Field must contain at least one upper-case letter';
}

/**
 * Checks if field does not contain email. Validator checks if given email is valid first. If it isn't
 * validator finishes its job and returns null. If email is valid, it is splitted into two parts on `@` sign and
 * for further checking only the first part is taken into account. All values are lowercased and validator checks
 * if text contains email at all.
 *
 * @function
 * @param {string} value text to be validated
 * @param {string} email text to compare
 * @returns {(null|string)} null if text does not contain email; error message otherwise
 */
export const notEmailValidator = (value, email) => {
  const isEmailInvalid = emailValidator(email);

  if (!value || isEmailInvalid) { return null; }

  const firstPart = email.split('@')[0].toLocaleLowerCase();

  return value.toLocaleLowerCase().includes(firstPart) ? 'Field must not contain email' : null;
}

/**
 * Checks if two text values are equal. If one of them is falsy validator finishes its job
 * and returns null;
 *
 * @function
 * @param {string} sourceValue
 * @param {string} targetValue
 * @returns null if strings are the same; error message otherwise
 */
export const equalFieldValidator = (sourceValue, targetValue) => {
  // if source or target is empty, null or undefined validator should be skipped
  if (!(sourceValue && targetValue)) { return null; }

  return sourceValue === targetValue ? null : 'Fields are not equal';
}

/**
 *
 * @param {string} value field's value
 * @param {RegExp} regex regex to be tested against
 * @returns {null|string} returns null if value is valid; string otherwise
 */
export const patternValidator = (value, regex) => {
  if (!value || regex.test(value)) {
    return null;
  }

  return 'Field is not valid';
}

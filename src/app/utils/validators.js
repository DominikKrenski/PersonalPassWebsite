export const requiredValidator = value => {
  if (value && value.trim().length > 0) {
    return null;
  }

  return 'Field is required';
}

export const emailValidator = value => {
  const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(value) ? null : 'Email is not valid';
}

export const minLengthValidator = (value, minLength) => {
  if(value && value.trim().length >= minLength) {
    return null;
  }

  return minLength;
}

export const maxLengthValidator = (value, maxLength) => {
  if (!value || value.trim().length <= maxLength) {
    return null;
  }

  return maxLength;
}

export const atLeastOneDigitValidator = value => {
  const regex = /^.*[0-9].*$/;

  if (value && regex.test(value)) {
    return null;
  }

  return 'Field must contain at least one digit';
}

export const atLeastOneLowercaseValidator = value => {
  const regex = /^.*[a-zęóąśłżźćń].*$/;

  if (value && regex.test(value)) {
    return null;
  }

  return 'Field must contain at least one lower-case letter';
}

export const atLeastOneUppercaseValidator = value => {
  const regex = /^.*[A-ZĘÓĄŚŁŻŹĆŃ].*$/;

  if (value && regex.test(value)) {
    return null;
  }

  return 'Field must contain at least one upper-case letter';
}

export const notEmailValidator = (value, email) => {
  const isEmailInvalid = emailValidator(email);

  if (isEmailInvalid) { return null; }

  const firstPart = email.split('@')[0].toLocaleLowerCase();

  return value.trim().toLocaleLowerCase() === firstPart ? 'Field must not contain email' : null;
}

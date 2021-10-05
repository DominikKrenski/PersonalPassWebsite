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

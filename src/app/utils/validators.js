export const requiredValidator = value => {
  if (value && value.trim().length > 0) {
    return null;
  }

  return 'Field is required';
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

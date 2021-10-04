export const requiredValidator = value => {
  if (value && value.trim().length > 0) {
    return null;
  }

  return 'Field is required';
}

import { useState } from 'react';

import {
  requiredValidator,
  emailValidator,
  minLengthValidator,
  maxLengthValidator,
  atLeastOneDigitValidator,
  atLeastOneLowercaseValidator,
  atLeastOneUppercaseValidator,
  notEmailValidator,
  equalFieldValidator
} from '../utils/validators';

const useForm = options => {
  const [data, setData] = useState(options.initialValues || {});
  const [errors, setErrors] = useState({});
  const [isFormValidated, setFormValidated] = useState(false);

  const handleOnChange = key => e => {
    setData({
      ...data,
      [key]: e.target.value
    })
  }

  const validateField = (field, fieldValidators) => {
    if (!fieldValidators) { return; }

    const value = data[field];
    const fieldErrors = {};
    let result;

    if (fieldValidators.required) {
      result = requiredValidator(value);
      if (result) { fieldErrors.required = result; }
    }

    if (fieldValidators.email) {
      result = emailValidator(value);
      if (result) { fieldErrors.email = result; }
    }

    if (fieldValidators.minLength) {
      result = minLengthValidator(value, fieldValidators.minLength);
      if (result) { fieldErrors.minLength = result; }
    }

    if (fieldValidators.maxLength) {
      result = maxLengthValidator(value, fieldValidators.maxLength);
      if (result) { fieldErrors.maxLength = result; }
    }

    if (fieldValidators.atLeastOneDigit) {
      result = atLeastOneDigitValidator(value);
      if (result) { fieldErrors.atLeastOneDigit = result; }
    }

    if (fieldValidators.atLeastOneLowercase) {
      result = atLeastOneLowercaseValidator(value);
      if (result) { fieldErrors.atLeastOneLowercase = result; }
    }

    if (fieldValidators.atLeastOneUppercase) {
      result = atLeastOneUppercaseValidator(value);
      if (result) { fieldErrors.atLeastOneUppercase = result; }
    }

    if (fieldValidators.notEmail) {
      result = notEmailValidator(value, data[fieldValidators.notEmail]);
      if (result) { fieldErrors.notEmail = result; }
    }

    if (fieldValidators.equalField) {
      result = equalFieldValidator(value, data[fieldValidators.equalField]);
      if (result) { fieldErrors.equalField = result; }
    }

    return fieldErrors;
  }

  const performValidation = () => {
    const validators = options.validators;

    if (!validators) { return; }

    const validationErrors = {};
    let isFormValid = true;

    Object.keys(validators).forEach(field => {
      const fieldErrors = validateField(field, validators[field]);

      if (Object.keys(fieldErrors).length !== 0) { validationErrors[field] = fieldErrors; isFormValid = false; }
    });

    setFormValidated(true);

    setErrors({
      ...validationErrors
    });

    return isFormValid;
  }

  return [
    handleOnChange,
    performValidation,
    data,
    errors,
    isFormValidated
  ]
}

export default useForm;

/**
 * validators:
 *  required: boolean
 *  email: boolean
 *  minLength: number
 *  maxLength: number
 *  atLeastOneDigit: boolean
 *  atLeastOneLowercase: boolean
 *  atLeastOneUppercase: boolean
 *  notEmail: string (field containing email address)
 *  equalField: string (field to compare)
 */

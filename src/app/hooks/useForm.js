import { useState, useEffect } from 'react';

import {
  requiredValidator,
  emailValidator,
  minLengthValidator,
  maxLengthValidator,
  atLeastOneDigitValidator,
  atLeastOneLowercaseValidator,
  atLeastOneUppercaseValidator,
  notEmailValidator,
  equalFieldValidator,
  patternValidator
} from '../utils/validators';

const useForm = (options) => {
  const [data, setData] = useState(options.initialValues || {});
  const [errors, setErrors] = useState({});
  const [func, setFunc] = useState(() => () => {})
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = key => e => {
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

    if (fieldValidators.patternValidator) {
      result = patternValidator(value, fieldValidators.pattern);
      if (result) { fieldErrors.pattern = result; }
    }

    return fieldErrors;
  }

  const sanitizeField = (field, fieldSanitizers) => {
    let value = data[field];

    if (!fieldSanitizers) { return value; }

    if (fieldSanitizers.trim) {
      value = !value ? value : value.trim();
    }

    if (fieldSanitizers.date) {
      if (value) {
        let splitted = value.split('-');
        splitted = splitted.reverse();
        value = splitted.join('/');
      }
    }

    return value;
  }

  const handleSubmit = callback => {
    return e => {
      e.preventDefault();
      setFunc(() => callback);
      const validators = options.validators;

      //if (!validators) { callback(data); return; }
      if (!validators) {
        setErrors({});
        return;
      }

      const validationErrors = {};

      Object.keys(validators).forEach(field => {
        const fieldErrors = validateField(field, validators[field]);

        if (Object.keys(fieldErrors).length !== 0) {
          validationErrors[field] = fieldErrors;
        }
      });

      setErrors({...validationErrors});
      setIsSubmitted(true);
    }
  }

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitted) {
      const sanitizers = options.sanitizers;

      if (!sanitizers) {
        func(data);
        return;
      }

      const sanitizedValues = {};

      Object.keys(sanitizers).forEach(field => {
        sanitizedValues[field] = sanitizeField(field, sanitizers[field]);
      });

      func(sanitizedValues);

      /*setData({
        ...data,
        ...sanitizedValues
      });*/
    }
  }, [errors]);

  /*useEffect(() => {
    if (isSubmitted) {
      console.log(data);
      func(data);
    }
  }, [data]);*/

  return [
    handleChange,
    handleSubmit,
    data,
    errors
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

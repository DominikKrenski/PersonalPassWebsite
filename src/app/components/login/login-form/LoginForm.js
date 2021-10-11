import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useForm from '../../../hooks/useForm';

import ValidationMessage from '../../shared/validation-message/ValidationMessage';
import encryptionService from '../../../utils/EncryptionService';
import httpClient from '../../../utils/HttpClient';
import urls from '../../../utils/urls';

import './LoginForm.local.scss';

const LoginForm = () => {
  const [passwordFieldType, setPasswordFieldType] = useState('password');

  const [handleOnChange, performValidation, data, errors] = useForm({
    validators: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true
      }
    }
  });

  const handleEyeClick = () => {
    if (passwordFieldType === 'password') {
      setPasswordFieldType('text')
    } else {
      setPasswordFieldType('password')
    }
  }

  const handleLoginClick = async e => {
    e.preventDefault();

    if (!performValidation()) { return; }

    try {
      // get salt related to given email
      const saltHEX = await httpClient.post(urls.salt, {email: data.email})

      // restore derivation key
      const derivationKey = await encryptionService.regenerateDerivationKey(data.password, saltHEX);

      // prepare login data
      const loginData = await encryptionService.prepareLoginData(data.email, derivationKey);

      // send login request
      const res = await httpClient.post(urls.signin, loginData);

      // TODO after successful response -> encrypt derivationKey and store it in IndexedDB

    } catch(err) {
      if (err.response) {
        // request was made and server responded with status code that falls out of range of 2xx
        console.log(err.response);
      } else if (err.request) {
        // request was made but no response was received
        console.log(err.request);
      } else {
        // something happened in setting up the request that triggered an Error
        console.log(err);
      }
    }
  }

  return (
    <div id="login-form-wrapper" className="column is-half is-offset-one-quarter">
      <form noValidate={true}>
        {/* FORM HEADER */}
        <div id="login-form-header" className="columns is-multiline is-mobile">
          <div className="column is-one-third">
            <p>Log in</p>
          </div>

          <div className="column is-two-thirds">
            <p>or <Link to="/signup">Create an account</Link></p>
          </div>
        </div>

        <hr />

        {/* EMAIL FIELD */}
        <div className="field" id="email-field">
          <label className="label" htmlFor="email">Email</label>
          <div className="control has-icons-left">
            <input
              className={`input ${errors.email ? "error": ""}`}
              type="email"
              name="email"
              value={data.email || ''}
              onChange={handleOnChange('email')}
            />
            <span className="icon is-left">
              <FontAwesomeIcon icon="envelope" size="lg" />
            </span>
          </div>
          {
            errors.email &&
            <ValidationMessage field="email" errors={errors.email} />
          }
        </div>

        {/* PASSWORD FIELD */}
        <div className="field" id="password-field">
          <label className="label" htmlFor="password">Password</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className={`input ${errors.password ? "error": ""}`}
              type={passwordFieldType}
              name="password"
              value={data.password || ''}
              onChange={handleOnChange('password')}
            />
            <span className="icon is-left">
              <FontAwesomeIcon icon="lock" size="lg" />
            </span>
            <span id="eye-icon" className="icon is-right" onClick={handleEyeClick}>
              <FontAwesomeIcon
                icon={passwordFieldType === 'password' ? 'eye' : 'eye-slash'}
                size="lg"
              />
            </span>
          </div>
          {
            errors.password &&
            <ValidationMessage field="password" errors={errors.password} />
          }
        </div>

        {/* LOGIN BUTTON */}
        <div id="login-button" className="field">
          <div className="control">
            <button className="button is-fullwidth" onClick={handleLoginClick}>Log In</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default LoginForm;

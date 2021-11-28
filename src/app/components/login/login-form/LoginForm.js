import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useForm from '../../../hooks/useForm';

import ValidationMessage from '../../shared/validation-message/ValidationMessage';
import encryptionService from '../../../utils/EncryptionService';
import httpClient from '../../../utils/HttpClient';
import dateService from '../../../utils/DateService';
import errorService from '../../../utils/ErrorService';
import sessionService from '../../../utils/SessionService';
import dbService from '../../../utils/DatabaseService';
import urls from '../../../utils/urls';

import './LoginForm.local.scss';

const LoginForm = () => {
  const history = useHistory();

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
      const saltRes = await httpClient.post(urls.salt, {email: data.email});

      // restore derivation key
      const derivationKey = await encryptionService.regenerateDerivationKey(data.password, saltRes.data.salt);

      // prepare login data
      const loginData = await encryptionService.prepareLoginData(data.email, derivationKey);

      // send login request
      const res = await httpClient.post(urls.signin, loginData);

      // get user from access token
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;

      const user = JSON.parse(encryptionService.convertBase64ToString(accessToken.split(".")[1]));

      // save user's public id in session storage
      sessionService.clear();
      sessionService.set('account_id', user.sub);

      // encrypt derivation key
      const encryptedMaster = await encryptionService.encryptMasterKey(derivationKey, process.env.PRIVATE_KEY);

      // encrypt access_token
      const encryptedAccessToken = await encryptionService.encryptData(accessToken, derivationKey);

      // encrypt refresh_token
      const encryptedRefreshToken = await encryptionService.encryptData(refreshToken, derivationKey);

      // save derivation key access_token's and refresh_token's vector in Session Storage
      sessionService.set('private_vector', encryptedMaster.vector);
      sessionService.set('access_vector', encryptedAccessToken.vector);
      sessionService.set('refresh_vector', encryptedRefreshToken.vector);

      // save encrypted master key, access token and refresh token in IndexedDB
      const id = await dbService.accounts.put({
        account_id: user.sub,
        master_key: encryptedMaster.masterKey,
        access_token: encryptedAccessToken.encryptedData,
        refresh_token: encryptedRefreshToken.encryptedData
      });

      // redirect to secure area
      history.push('/secure');
    } catch(err) {
      if (err.response) {
        // request was made and server responded with status code that falls out of range of 2xx
        if (err.response.status < 500) {
          errorService.updateError(err.response.data);
        } else {
          errorService.updateError({
            status: 'Internal Server Error',
            timestamp: err.response.data.timestamp,
            message: 'Something went wrong. Please, try later'
          });
        }
      } else if (err.request) {
        // request was made but no response was received
        errorService.updateError({
          status: 'Internal Server Error',
          timestamp: dateService.getTimestamp(),
          message: 'Somethin went wrong. Please, try later'
        });
      } else {
        // something happened in setting up the request that triggered an Error
        errorService.updateError({
          status: 'Internal App Error',
          timestamp: dateService.getTimestamp(),
          message: 'Something went wrong during data encryption'
        });
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

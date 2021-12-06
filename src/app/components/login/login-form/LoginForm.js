import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useForm from '../../../hooks/useForm';

import ValidationMessage from '../../shared/validation-message/ValidationMessage';
import encryptionService from '../../../utils/EncryptionService';
import httpClient from '../../../utils/HttpClient';
import errorService from '../../../utils/ErrorService';
import accessService from '../../../utils/AccessService';
import urls from '../../../utils/urls';

import './LoginForm.local.scss';

const LoginForm = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [passwordFieldType, setPasswordFieldType] = useState('password');

  const [handleChange, handleSubmit, data, errors] = useForm({
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

  const submit = async data => {
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

      // encrypt and save all data
      await accessService.saveAccessData(user.sub, accessToken, refreshToken, derivationKey);

      // redirect to secure area
      history.push('/secure');
    } catch (err) {
      errorService.updateError(err);
    }
  }

  const handleEyeClick = () => {
    if (passwordFieldType === 'password') {
      setPasswordFieldType('text')
    } else {
      setPasswordFieldType('password')
    }
  }

  return (
    <div id="login-form-wrapper" className="column is-half is-offset-one-quarter">
      <form noValidate={true} autoComplete="off" onSubmit={handleSubmit(submit)}>
        {/* FORM HEADER */}
        <div id="login-form-header" className="columns is-multiline is-mobile">
          <div className="column is-one-third">
            <p>{t('loginForm.header')}</p>
          </div>

          <div className="column is-two-thirds">
            <p>{t('loginForm.or')} <Link to="/signup">{t('loginForm.registerLink')}</Link></p>
          </div>
        </div>

        <hr />

        {/* EMAIL FIELD */}
        <div className="field" id="email-field">
          <label className="label" htmlFor="email">{t('loginForm.emailLabel')}</label>
          <div className="control has-icons-left">
            <input
              className={`input ${errors.email ? "error": ""}`}
              type="email"
              name="email"
              value={data.email || ''}
              onChange={handleChange('email')}
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
          <label className="label" htmlFor="password">{t('loginForm.passwordLabel')}</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className={`input ${errors.password ? "error": ""}`}
              type={passwordFieldType}
              name="password"
              value={data.password || ''}
              onChange={handleChange('password')}
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
            <button className="button is-fullwidth">{t('loginForm.button')}</button>
          </div>
        </div>
      </form>

      {/* PASSWORD HINT LINK */}
      <div id="password-hint">
        <Link to="/password-hint">FORGOT PASSWORD?</Link>
      </div>
    </div>
  )
}

export default LoginForm;

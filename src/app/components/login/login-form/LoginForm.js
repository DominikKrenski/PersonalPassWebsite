import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HashLoader from 'react-spinners/HashLoader';

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

  const spinnerColor = "#e20000";

  const [passwordFieldType, setPasswordFieldType] = useState('password');
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      // get salt related to given email
      const saltRes = await httpClient.post(urls.salt, {email: data.email});

      // restore derivation key
      const derivationKey = await encryptionService.regenerateDerivationKey(data.password, saltRes.data.salt);

      // prepare login data
      const loginData = await encryptionService.prepareLoginData(data.email, derivationKey);

      // send login request
      const res = await httpClient.post(urls.signin, loginData);

      const { accessToken, refreshToken, key } = res.data;

      // get user from access token
      //const accessToken = res.data.accessToken;
      //const refreshToken = res.data.refreshToken;

      const user = JSON.parse(encryptionService.convertBase64ToString(accessToken.split(".")[1]));

      // encrypt and save all data
      await accessService.saveAccessData(user.sub, accessToken, refreshToken, derivationKey, key);

      setLoading(false);
      // redirect to secure area
      history.push('/secure');
    } catch (err) {
      setLoading(false);
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

      {
        loading &&
        <div id="spinner-wrapper">
          <HashLoader loading={loading} color={spinnerColor} size={150} />
        </div>
      }

      {/*<HashLoader loading={loading} css={override} size={150} />*/}

      <form noValidate={true} autoComplete="off" onSubmit={handleSubmit(submit)}>
        {/* FORM HEADER */}
        <div id="login-form-header" className="columns is-multiline is-mobile">
          <div className="column is-one-third">
            <p>{t('header', { ns: 'login_form' })}</p>
          </div>

          <div className="column is-two-thirds">
            <p>{t('or', { ns: 'login_form' })} <Link to="/signup">{t('registerLink', { ns: 'login_form' })}</Link></p>
          </div>
        </div>

        <hr />

        {/* EMAIL FIELD */}
        <div className="field" id="email-field">
          <label className="label" htmlFor="email">{t('emailLabel', { ns: 'login_form' })}</label>
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
          <label className="label" htmlFor="password">{t('passwordLabel', { ns: 'login_form' })}</label>
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
            <button type="submit" className="button is-fullwidth">{t('button', { ns: 'login_form' })}</button>
          </div>
        </div>
      </form>

      {/* PASSWORD HINT LINK */}
      <div id="password-hint">
        <Link to="/password-hint">{t('forgotLink', { ns: 'login_form' })}</Link>
      </div>
    </div>
  )
}

export default LoginForm;

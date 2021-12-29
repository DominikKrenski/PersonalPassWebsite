import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HashLoader from 'react-spinners/HashLoader';

import ValidationMessage from '../../shared/validation-message/ValidationMessage';
import StatusIcon from '../status-icon/StatusIcon';

import useForm from '../../../hooks/useForm';
import encryptionService from '../../../utils/EncryptionService';
import errorService from '../../../utils/ErrorService';
import httpClient from '../../../utils/HttpClient';
import urls from '../../../utils/urls';

import './RegistrationForm.local.scss';

const RegistrationForm = () => {
  const { t } = useTranslation();
  const [passwordFieldType, setPasswordFieldType] = useState('password');
  const [requirementsVisible, setRequirementsVisible] = useState(false);
  const [isFormValidated, setFormValidated] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const spinnerColor = "#e20000";

  const submit = async data => {
    try {
      setLoading(true);
      const registrationData = await encryptionService.prepareRegistrationData(data);
      await httpClient.post(urls.signup, registrationData);

      setLoading(false);

      history.push('/signin');
    } catch (err) {
      setLoading(false);
      errorService.updateError(err);
    }
  }

  const [handleChange, handleSubmit, data, errors] = useForm({
    validators: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minLength: 12,
        atLeastOneDigit: true,
        atLeastOneLowercase: true,
        atLeastOneUppercase: true,
        notEmail: 'email'
      },
      passwordConfirm: {
        required: true,
        equalField: 'password'
      },
      reminder: {
        maxLength: 255
      }
    }
  });

  useEffect(() => {
    if (renderCount !== 0) {
      if (!requirementsVisible) {
        setRequirementsVisible(true);
      }
      setFormValidated(true);
    }

    setRenderCount(prev => prev + 1);
  }, [errors]);

  const handleEyeClick = () => {
    if (passwordFieldType === 'password') {
      setPasswordFieldType('text');
    } else {
      setPasswordFieldType('password');
    }
  }

  const handlePasswordFocus = () => {
    setRequirementsVisible(true);
  }

  return (
    <div id="registration-form-wrapper" className="column is-half is-offset-one-quarter">

      {
        loading &&
        <div id="spinner-wrapper">
          <HashLoader loading={loading} color={spinnerColor} size={150} />
        </div>
      }

      <form noValidate={true} autoComplete="off" onSubmit={handleSubmit(submit)}>
        {/* FORM HEADER */}
        <div id="registration-form-header" className="columns is-multiline is-mobile">
          <div className="column is-two-thirds">
            <p>{t('header', { ns: 'registration_form' })}</p>
          </div>

          <div className="column is-one-third">
            <p>{t('or', { ns: 'registration_form' })} <Link to="/signin">{t('loginLink', { ns: 'registration_form' })}</Link></p>
          </div>
        </div>

        <hr />

        {/* EMAIL FIELD */}
        <div className="field" id="email-field">
          <label className="label" htmlFor="email">{t('emailLabel', { ns: 'registration_form' })}</label>
          <div className="control has-icons-left">
            <input
              className={`input ${errors.email ? "error" : ""}`}
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
          <label className="label" htmlFor="password">{t('passwordLabel', { ns: 'registration_form' })}</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className={`input ${errors.password ? "error" : ""}`}
              type={passwordFieldType}
              onFocus={handlePasswordFocus}
              name="password"
              value={data.password || ''}
              onChange={handleChange('password')}
            />
            <span className="icon is-left">
              <FontAwesomeIcon icon="lock" size="lg"/>
            </span>
            <span id="eye-icon" className="icon is-right" onClick={handleEyeClick}>
              <FontAwesomeIcon
                icon={passwordFieldType === 'password' ? 'eye' : 'eye-slash'}
                size="lg"
              />
            </span>
          </div>
        </div>

        {/* PASSWORD REQUIREMENTS FIELD */}
        {requirementsVisible &&
          <div id="password-requirements" className="field">
            <p>{t('requirements.header', { ns: 'registration_form' })}</p>
            <ul>
              <li>
                <StatusIcon
                  validated={isFormValidated}
                  error={errors.password?.minLength}
                /> {t('requirements.minLength', { ns: 'registration_form' })}
              </li>
              <li>
                <StatusIcon
                  validated={isFormValidated}
                  error={errors.password?.atLeastOneDigit}
                /> {t('requirements.digit', { ns: 'registration_form' })}
              </li>
              <li>
                <StatusIcon
                  validated={isFormValidated}
                  error={errors.password?.atLeastOneLowercase}
                /> {t('requirements.lowercase', { ns: 'registration_form' })}
              </li>
              <li>
                <StatusIcon
                  validated={isFormValidated}
                  error={errors.password?.atLeastOneUppercase}
                /> {t('requirements.uppercase', { ns: 'registration_form' })}
              </li>
              <li>
                <StatusIcon
                  validated={isFormValidated}
                  error={errors.password?.notEmail}
                /> {t('requirements.email', { ns: 'registration_form' })}
              </li>
            </ul>
          </div>
        }

        {/* PASSWORD CONFIRM FIELD */}
        <div className="field" id="password-confirm-field">
          <label className="label" htmlFor="passwordConfirm">{t('confirmLabel', { ns: 'registration_form' })}</label>
          <div className="control has-icons-left">
            <input
              className={`input ${errors.passwordConfirm ? "error" : ""}`}
              type="password"
              name="passwordConfirm"
              value={data.passwordConfirm || ''}
              onChange={handleChange('passwordConfirm')}
            />
            <span className="icon is-left">
              <FontAwesomeIcon icon="lock" size="lg"/>
            </span>
          </div>
          {
            errors.passwordConfirm &&
            <ValidationMessage field="passwordConfirm" errors={errors.passwordConfirm}/>
          }
        </div>

        {/* REMINDER FIELD */}
        <div className="field" id="reminder-field">
          <label className="label" htmlFor="reminder">{t('reminderLabel', { ns: 'registration_form' })}</label>
          <div className="control has-icons-left">
            <input
              className={`input ${errors.reminder ? "error" : ""}`}
              type="text"
              name="reminder"
              value={data.reminder || ''}
              onChange={handleChange('reminder')}
            />
            <span className="icon is-left">
              <FontAwesomeIcon icon="sticky-note" size="lg"/>
            </span>
          </div>
          {
            errors.reminder &&
            <ValidationMessage field="reminder" errors={errors.reminder}/>
          }
        </div>

        {/* REGISTRATION BUTTON */}
        <div id="registration-button" className="field">
          <div className="control">
            <button type="submit" className="button is-fullwidth">{t('button', { ns: 'registration_form' })}</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegistrationForm;

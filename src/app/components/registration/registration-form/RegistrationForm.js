import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  const [handleOnChange, performValidation, data, errors, isFormValidated] = useForm({
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

  const history = useHistory();

  const handleRegisterClick = async e => {
    e.preventDefault();

    if (!performValidation()) {
      if (!requirementsVisible) {
        setRequirementsVisible(true);
      }

      return;
    }

    try {
      const registrationData = await encryptionService.prepareRegistrationData(data);
      const res = await httpClient.post(urls.signup, registrationData);
      history.push('/signin');
    } catch (err) {
      errorService.updateError(err);
    }
  }

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
      <form noValidate={true}>
        {/* FORM HEADER */}
        <div id="registration-form-header" className="columns is-multiline is-mobile">
          <div className="column is-two-thirds">
            <p>{t('registrationForm.header')}</p>
          </div>

          <div className="column is-one-third">
            <p>{t('registrationForm.or')} <Link to="/signin">{t('registrationForm.loginLink')}</Link></p>
          </div>
        </div>

        <hr />

        {/* EMAIL FIELD */}
        <div className="field" id="email-field">
          <label className="label" htmlFor="email">{t('registrationForm.emailLabel')}</label>
          <div className="control has-icons-left">
            <input
              className={`input ${errors.email ? "error" : ""}`}
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
          <label className="label" htmlFor="password">{t('registrationForm.passwordLabel')}</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className={`input ${errors.password ? "error" : ""}`}
              type={passwordFieldType}
              onFocus={handlePasswordFocus}
              name="password"
              value={data.password || ''}
              onChange={handleOnChange('password')}
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
            <p>{t('registrationForm.requirements.header')}</p>
            <ul>
              <li>
                <StatusIcon
                  validated={isFormValidated}
                  error={errors.password?.minLength}
                /> {t('registrationForm.requirements.minLength')}
              </li>
              <li>
                <StatusIcon
                  validated={isFormValidated}
                  error={errors.password?.atLeastOneDigit}
                /> {t('registrationForm.requirements.digit')}
              </li>
              <li>
                <StatusIcon
                  validated={isFormValidated}
                  error={errors.password?.atLeastOneLowercase}
                /> {t('registrationForm.requirements.lowercase')}
              </li>
              <li>
                <StatusIcon
                  validated={isFormValidated}
                  error={errors.password?.atLeastOneUppercase}
                /> {t('registrationForm.requirements.uppercase')}
              </li>
              <li>
                <StatusIcon
                  validated={isFormValidated}
                  error={errors.password?.notEmail}
                /> {t('registrationForm.requirements.email')}
              </li>
            </ul>
          </div>
        }

        {/* PASSWORD CONFIRM FIELD */}
        <div className="field" id="password-confirm-field">
          <label className="label" htmlFor="passwordConfirm">{t('registrationForm.confirmLabel')}</label>
          <div className="control has-icons-left">
            <input
              className={`input ${errors.passwordConfirm ? "error" : ""}`}
              type="password"
              name="passwordConfirm"
              value={data.passwordConfirm || ''}
              onChange={handleOnChange('passwordConfirm')}
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
          <label className="label" htmlFor="reminder">{t('registrationForm.reminderLabel')}</label>
          <div className="control has-icons-left">
            <input
              className={`input ${errors.reminder ? "error" : ""}`}
              type="text"
              name="reminder"
              value={data.reminder || ''}
              onChange={handleOnChange('reminder')}
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
            <button className="button is-fullwidth" onClick={handleRegisterClick}>{t('registrationForm.button')}</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegistrationForm;

import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

import useForm from '../../../hooks/useForm';
import httpClient from '../../../utils/HttpClient';
import errorService from '../../../utils/ErrorService';
import urls from '../../../utils/urls';

import './PasswordHintForm.local.scss';

const PasswordHintForm = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const submit = async data => {
    try {
      await httpClient.post(urls.sendHint, data);
      alert(t('confirmMessage', { ns: 'password_hint' }).replace('_', `${data.email}`));
      history.push('/signin');
    } catch (err) {
      errorService.updateError(err);
    }

  }

  const [handleChange, handleSubmit, data, errors] = useForm(
    {
      validators: {
        email: {
          required: true,
          email: true
        }
      }
    }
  );

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      alert(t('errorMessage', { ns: 'password_hint' }));
    }
  }, [errors]);

  return (
    <div id="password-hint-form-wrapper" className="column is-half is-offset-one-quarter">
      <form noValidate={true} autoComplete="off" onSubmit={handleSubmit(submit)}>
        {/* FORM HEADER */}
        <div id="password-hint-form-header" className="column is-fullwidth">
          <p id="first-line">{t('headerFirst', { ns: 'password_hint' })}</p>
          <p>{t('headerSecond', { ns: 'password_hint' })}</p>
        </div>

        {/* EMAIL FIELD */}
        <div id="label" className="field">
          <label className="label" htmlFor="email">{t('label', { ns: 'password_hint' })}</label>
        </div>
        <div className="field is-grouped">
          <p className="control is-expanded">
            <input
              className={`input ${errors.email ? "error" : ""}`}
              type="email"
              name="email"
              value={data.email || ''}
              onChange={handleChange('email')}
            />
          </p>
          <p className="control">
            <button
              className="button"
              type="submit"
            >
              {t('buttonText', { ns: 'password_hint' })}
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

export default PasswordHintForm;

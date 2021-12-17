import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import useForm from '../../../hooks/useForm';
import httpClient from '../../../utils/HttpClient';
import errorService from '../../../utils/ErrorService';
import urls from '../../../utils/urls';

import ValidationMessage from '../validation-message/ValidationMessage';

import './EmailUpdateForm.local.scss';

const EmailUpdateForm = props => {
  const { t } = useTranslation();
  const { initialValue, successCallback, closeCallback } = props.opts;

  const [handleOnChange, performValidation, data, errors] = useForm({
    validators: {
      email: {
        required: true,
        email: true
      }
    }
  });

  const handleCloseIconClick = () => {
    closeCallback(null);
  }

  const handleUpdateButtonClick = async e => {
    e.preventDefault();

    if (!performValidation()) {
      return;
    }

    // check if new email is the same as old email, if so close form
    if (data.email.toLocaleLowerCase() === initialValue.toLocaleLowerCase()) {
      closeCallback(null);
      return;
    }

    try {
      const res = await httpClient.put(urls.updateEmail, { email: data.email });
      // invoke update function and close form
      successCallback(res.data);
      closeCallback(null);
    } catch (err) {
      errorService.updateError(err);
      closeCallback(null);
    }
  }

  return (
    <div id="email-wrapper" className="columns">
      <div className="column is-half is-offset-one-quarter">
        <div id="email-form">
          <form noValidate={true}>
            <div id="email-form-title">
              <div><h1>{t('title', { ns: 'email_update' })}</h1></div>
              <div
                id="close-icon"
                onClick={handleCloseIconClick}
              >
                <FontAwesomeIcon icon="times-circle" size="lg" />
              </div>
            </div>

            <div id="email-form-content">
              <div className="field">
                <label className="label" htmlFor="field">{t('label', { ns: 'email_update' })}</label>
                <div className="control has-icons-left">
                  <input
                    placeholder={initialValue}
                    className="input"
                    type="email"
                    name="email"
                    value={data.email || ''}
                    onChange={handleOnChange('email')}
                    autoFocus={true}
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

              <div id="email-update-button">
                <div className="control">
                  <button
                    type="submit"
                    className="button is-fullwidth"
                    onClick={handleUpdateButtonClick}
                  >
                    {t('button', { ns: 'email_update' })}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

EmailUpdateForm.propTypes = {
  opts: PropTypes.exact({
    initialValue: PropTypes.string,
    successCallback: PropTypes.func,
    closeCallback: PropTypes.func
  })
}

export default EmailUpdateForm;

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

import httpClient from "../../../../utils/HttpClient";
import accessService from "../../../../utils/AccessService";
import encryptionService from "../../../../utils/EncryptionService";
import errorService from "../../../../utils/ErrorService";
import useForm from "../../../../hooks/useForm";
import types from '../../../../utils/types';
import urls from "../../../../utils/urls";

import ValidationMessage from "../../../shared/validation-message/ValidationMessage";

import './PasswordForm.local.scss';

const PasswordForm = props => {
  const { closeCallback, successCallback, pass, type } = props;

  const { t } = useTranslation();

  const [accessData, setAccessData] = useState(null);

  useEffect(() => {
    const accessSubscription = accessService.getAccessData().subscribe(data => setAccessData(data));

    return () => accessSubscription.unsubscribe();
  }, []);

  const handleCancelButtonClick = () => {
    closeCallback(false);
  }

  const setInitialValues = () => {
    const values = {
      ...(pass.entry.entryTitle && { entryTitle: pass.entry.entryTitle }),
      ...(pass.entry.url && { url: pass.entry.url }),
      ...(pass.entry.username && { username: pass.entry.username }),
      ...(pass.entry.password && { password: pass.entry.password }),
      ...(pass.entry.notes) && { notes: pass.entry.notes }
    }

    return values;
  }

  let submitFunc = null;
  let formHeader = null;
  let formFooter = null;
  let initialValues = {};

  if (type === 'add') {
    submitFunc = async data => {
      try {
        const encryptedPass = await encryptionService.encryptData(JSON.stringify(data), accessData.masterKey);
        await httpClient.post(
          urls.data,
          {
            entry: `${encryptedPass.vector}.${encryptedPass.encryptedData}`,
            type: types.password
          }
        );
        successCallback(true);
        closeCallback(false);
      } catch (err) {
        errorService.updateError(err);
        closeCallback(false);
      }
    }

    formHeader = (
      <h1>{t('addFormHeader', { ns: 'password_form' })}</h1>
    )

    formFooter = (
      <div className="field is-grouped is-grouped-right">
        <p className="control">
          <button className="button is-small is-rounded" onClick={handleCancelButtonClick}>
            {t('cancelButton', { ns: 'password_form' })}
          </button>
        </p>
        <p className="control">
          <button id="send-button" type="submit" className="button is-small is-rounded">
            {t('addButton', { ns: 'password_form' })}
          </button>
        </p>
      </div>
    )
  } else if (type === 'edit') {
    initialValues = setInitialValues();

    submitFunc = async data => {
      try {
        const encryptedPass = await encryptionService.encryptData(JSON.stringify(data), accessData.masterKey);
        await httpClient.put(
          `${urls.data}/${pass.id}`,
          {
            entry: `${encryptedPass.vector}.${encryptedPass.encryptedData}`
          }
        );
        successCallback(true);
        closeCallback(false);
      } catch (err) {
        errorService.updateError(err);
        closeCallback(false);
      }
    }

    formHeader = (
      <h1>{t('editFormHeader', { ns: 'password_form' })}</h1>
    )

    formFooter = (
      <div className="field is-grouped is-grouped-right">
        <p className="control">
          <button className="button is-small is-rounded" onClick={handleCancelButtonClick}>
            {t('cancelButton', { ns: 'password_form' })}
          </button>
        </p>
        <p className="control">
          <button id="send-button" type="submit" className="button is-small is-rounded">
            {t('editButton', { ns: 'password_form' })}
          </button>
        </p>
      </div>
    )
  } else {
    initialValues = setInitialValues();

    formHeader = (
      <h1>{t('showFormHeader', { ns: 'password_form' })}</h1>
    )

    formFooter = (
      <div className="field is-grouped is-grouped-right">
        <p className="button is-small is-rounded" onClick={handleCancelButtonClick}>
          {t('closeButton', { ns: 'password_form' })}
        </p>
      </div>
    )
  }

  const [handleChange, handleSubmit, data, errors] = useForm({
    ...(Object.keys(initialValues) && { 'initialValues': initialValues }),
    validators: {
      entryTitle: {
        required: true,
        maxLength: 100
      },
      url: {
        maxLength: 2048
      },
      username: {
        required: true,
        maxLength: 100
      },
      password: {
        required: true,
        maxLength: 100
      },
      notes: {
        maxLength: 1000
      }
    },
    sanitizers: {
      entryTitle: {
        trim: true
      },
      url: {
        trim: true
      },
      username: {
        trim: true
      },
      notes: {
        trim: true
      }
    }
  });

  return (
    <div id="password-form-wrapper">
      <div className="column is-half is-offset-one-quarter">
        <div id="password-form">

          <div id="form-header">
            {formHeader}
          </div>

          <form noValidate={true} autoComplete="off" onSubmit={handleSubmit(submitFunc)}>
            <div className="field">
              <label className="label" htmlFor="entryTitle">{t('entryTitleLabel', { ns: 'password_form' })}<span>*</span></label>
              <div className="control">
                <input
                  className={`input ${errors.entryTitle} ? "error" : ""`}
                  type="text"
                  name="entryTitle"
                  value={data.entryTitle || ''}
                  disabled={type === 'show' ? true : false}
                  onChange={handleChange('entryTitle')}
                />
              </div>
              {
                errors.entryTitle &&
                <ValidationMessage field="entryTitle" errors={errors.entryTitle} />
              }
            </div>

            <div className="field">
              <label className="label" htmlFor="url">URL</label>
              <div className="control">
                <input
                  className={`input ${errors.url} ? "error": ""`}
                  type="text"
                  name="url"
                  value={data.url || ''}
                  disabled={type === 'show' ? true : false}
                  onChange={handleChange('url')}
                />
              </div>
              {
                errors.url &&
                <ValidationMessage field="url" errors={errors.url} />
              }
            </div>

            <div id="two-fields" className="columns">
              <div className="field column is-6" >
                <label className="label" htmlFor="username">{t('usernameLabel', { ns: 'password_form' })}<span>*</span></label>
                <div className="control">
                  <input
                    className={`input ${errors.username} ? "error" : ""`}
                    type="text"
                    name="username"
                    value={data.username || ''}
                    disabled={type === 'show' ? true : false}
                    onChange={handleChange('username')}
                  />
                </div>
                {
                  errors.username &&
                  <ValidationMessage field="username" errors={errors.username} />
                }
              </div>

              <div className="field column is-6">
                <label className="label" htmlFor="password">{t('passwordLabel', { ns: 'password_form' })}<span>*</span></label>
                <div className="control">
                  <input
                    className={`input ${errors.password} ? "error" : ""`}
                    type="text"
                    name="password"
                    value={data.password || ''}
                    disabled={type === 'show' ? true : false}
                    onChange={handleChange('password')}
                  />
                </div>
                {
                  errors.password &&
                  <ValidationMessage field="password" errors={errors.password} />
                }
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="notes">{t('notesLabel', { ns: 'password_form' })}</label>
              <div className="control">
                <textarea
                  className={`textarea ${errors.notes} ? "error": ""`}
                  rows={10}
                  name="notes"
                  value={data.notes || ''}
                  disabled={type === 'show' ? true : false}
                  onChange={handleChange('notes')}
                />
              </div>
              {
                errors.notes &&
                <ValidationMessage field="notes" errors={errors.notes} />
              }
            </div>
            { formFooter }
          </form>
        </div>
      </div>
    </div>
  )
}

PasswordForm.propTypes = {
  type: PropTypes.oneOf(['add', 'edit', 'show']).isRequired,
  successCallback: PropTypes.func.isRequired,
  closeCallback: PropTypes.func.isRequired,
  pass: PropTypes.exact({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    entry: PropTypes.exact({
      entryTitle: PropTypes.string.isRequired,
      url: PropTypes.string,
      username: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      notes: PropTypes.string
    })
  })
}

export default PasswordForm;

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HashLoader from 'react-spinners/HashLoader';
import PropTypes from 'prop-types';

import useForm from '../../../../hooks/useForm';
import httpClient from '../../../../utils/HttpClient';
import accessService from '../../../../utils/AccessService';
import encryptionService from '../../../../utils/EncryptionService';
import errorService from '../../../../utils/ErrorService';
import urls from '../../../../utils/urls';
import i18n from '../../../../i18n';

import ValidationMessage from '../../../shared/validation-message/ValidationMessage';

import './PasswordUpdateForm.local.scss';

const PasswordUpdateForm = props => {
  const { successCallback, closeCallback } = props;

  const [accessData, setAccessData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const spinnerColor = "#e20000";

  useEffect(() => {
    const accessSubscription = accessService.getAccessData().subscribe(data => setAccessData(data));

    return () => accessSubscription.unsubscribe();
  }, []);

  const [handleChange, handleSubmit, data, errors] = useForm({
    validators: {
      oldPassword: {
        required: true
      },
      newPassword: {
        required: true,
        minLength: 12,
        atLeastOneDigit: true,
        atLeastOneLowercase: true,
        atLeastOneUppercase: true
      },
      newPasswordConfirm: {
        required: true,
        equalField: 'newPassword'
      },
      reminder: {
        maxLength: 255
      }
    },
    sanitizers: {
      reminder: {
        trim: true
      }
    }
  });

  const submit = async data => {
    try {
      setLoading(true);

      // get salt for currently logged user
      const saltRes = await httpClient.get(urls.accountSalt);

      // regenerate derivation key
      const regeneratedMaster = await encryptionService.regenerateDerivationKey(data.oldPassword, saltRes.data.salt);

      // compare master keys
      const keysEqual = encryptionService.compareMasterKeys(accessData.masterKey, regeneratedMaster);

      if (!keysEqual) {
        let msg = 'You are not allowed to change password';

        if (i18n.language == 'pl' || i18n.language == 'pl-PL') {
          msg = 'Brak uprawnień do zmiany hasła';
        }

        throw new Error(msg);
      }

      // check if old key and new key are equals, if so -> return from functions
      if(data.oldPassword === data.newPassword) {
        setLoading(false);
        successCallback();
        return;
      }

      // generate new master key
      const updateKeyData = await encryptionService.prepareUpdatePasswordData(data.newPassword);

      // get all user data
      const dataRes = await httpClient.get(`${urls.data}/all`);

      // decrypt all received data
      let arr = [];

      if (dataRes.data && dataRes.data.length > 0) {
        arr = await Promise.all(dataRes.data.map(async item => {
          const dataChunks = item.entry.split('.');
          item.entry = await encryptionService.decryptData(dataChunks[1], dataChunks[0], accessData.masterKey);

          return item;
        }));
      }

      // encrypt all data with new derivation key
      if (arr.length > 0) {
        arr = await Promise.all(arr.map(async item => {
          const encData = await encryptionService.encryptData(item.entry, updateKeyData.derivationKey);
          item.entry = `${encData.vector}.${encData.encryptedData}`;

          return item;
        }));
      }

      // change all entries related to access functionality in SessionService and IndexedDB
      await accessService.changeMasterKey(updateKeyData.derivationKey);

      const formData = {
        password: updateKeyData.derivationKeyHash,
        salt: updateKeyData.salt,
        data: arr
      }

      if (data.reminder && data.reminder.length !== 0) {
        formData.reminder = data.reminder;
      }

      // send request to the server with new data
      await httpClient.put(urls.accountDetails, formData);

      setLoading(false);
      successCallback();
    } catch (err) {
      setLoading(false);
      errorService.updateError(err);
      closeCallback();
    }
  }

  return (
    <div id="password-update-form-wrapper" className="columns">

      {
        loading &&
        <div id="spinner-wrapper">
          <HashLoader loading={loading} color={spinnerColor} size={150} />
        </div>
      }

      <div className="column is-half is-offset-one-quarter">
        <div id="password-update-form">
          <div id="form-header">
            <h1>{t('formHeader', { ns: 'pass_update_form' })}</h1>
          </div>

          <form noValidate={true} autoComplete="off" onSubmit={handleSubmit(submit)}>
            <div className="field">
              <label className="label" htmlFor="oldPassword">{t('oldPassLabel', { ns: 'pass_update_form' })} <span className="span-label">*</span></label>
              <div className="control has-icons-left">
                <input
                  className={`input ${errors.oldPassword ? "error": ""}`}
                  type="password"
                  name="oldPassword"
                  onChange={handleChange('oldPassword')}
                />
                <span className="icon is-left">
                  <FontAwesomeIcon icon="lock" size="lg" />
                </span>
              </div>
              {
                errors.oldPassword &&
                <ValidationMessage field="oldPassword" errors={errors.oldPassword} />
              }
            </div>

            <div className="field">
              <label className="label" htmlFor="newPassword">{t('newPass', { ns: 'pass_update_form' })} <span className="span-label">*</span></label>
              <div className="control has-icons-left">
                <input
                  className={`input ${errors.newPassword ? "error": ""}`}
                  type="password"
                  name="newPassword"
                  onChange={handleChange('newPassword')}
                />
                <span className="icon is-left">
                  <FontAwesomeIcon icon="lock" size="lg" />
                </span>
              </div>
              {
                errors.newPassword &&
                <ValidationMessage field="newPassword" errors={errors.newPassword} />
              }
            </div>

            <div className="field">
              <label className="label" htmlFor="newPasswordConfirm">{t('confirmPass', { ns: 'pass_update_form' })} <span className="span-label">*</span></label>
              <div className="control has-icons-left">
                <input
                  className={`input ${errors.newPasswordConfirm ? "error" : ""}`}
                  type="password"
                  name="newPasswordConfirm"
                  onChange={handleChange('newPasswordConfirm')}
                />
                <span className="icon is-left">
                  <FontAwesomeIcon icon="lock" size="lg" />
                </span>
              </div>
              {
                errors.newPasswordConfirm &&
                <ValidationMessage field="newPasswordConfirm" errors={errors.newPasswordConfirm} />
              }
            </div>

            <div className="field">
              <label className="label" htmlFor="reminder">{t('reminder', { ns: 'pass_update_form' })}</label>
              <div className="control">
                <input
                  className={`input ${errors.reminder ? "error": ""}`}
                  type="text"
                  name="reminder"
                  onChange={handleChange('reminder')}
                />
              </div>
              {
                errors.reminder &&
                <ValidationMessage field="reminder" errors={errors.reminder} />
              }
            </div>

            <div className="field is-grouped is-grouped-right">
              <p className="control">
                <button
                  className="button is-small is-rounded"
                  onClick={closeCallback}
                >
                  {t('cancelButton', { ns: 'pass_update_form' })}
                </button>
              </p>
              <p className="control">
                <button id="send-button" className="button is-small is-rounded" type="submit">
                  {t('confirmButton', { ns: 'pass_update_form' })}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

PasswordUpdateForm.propTypes = {
  successCallback: PropTypes.func.isRequired,
  closeCallback: PropTypes.func.isRequired
}

export default PasswordUpdateForm;

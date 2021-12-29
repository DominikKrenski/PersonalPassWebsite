import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HashLoader from 'react-spinners/HashLoader';

import accessService from '../../../utils/AccessService';
import encryptionService from '../../../utils/EncryptionService';
import errorService from '../../../utils/ErrorService';
import httpClient from '../../../utils/HttpClient';
import types from '../../../utils/types';
import urls from '../../../utils/urls';

import PasswordForm from './password-form/PasswordForm';
import DataTable from '../../shared/data-table/DataTable';
import Confirmation from '../../shared/confirmation/Confirmation';
import AppError from '../../shared/app-error/AppError';

import './Password.local.scss';

const Password = () => {
  const [serverData, setServerData] = useState(null);
  const [decodedData, setDecodedData] = useState([]);
  const [successfulResponse, setSuccessfulResponse] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [showFormVisible, setShowFormVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [accessData, setAccessData] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const spinnerColor = "#e20000";

  useEffect(() => {
    errorService.clearError();
    const errorSubscription = errorService.getError().subscribe(err => setApiError(err));

    return () => errorSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    const accessSubscription = accessService.getAccessData().subscribe(data => setAccessData(data));

    return () => accessSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await accessService.passAccessData();
        const res = await httpClient.get(`${urls.data}?type=${types.password}`);
        setServerData(res.data);
      } catch (err) {
        errorService.updateError(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (successfulResponse) {
        try {
          const res = await httpClient.get(`${urls.data}?type=${types.password}`);
          setServerData(res.data);
        } catch (err) {
          errorService.updateError(err);
        }
      }
    })();
  }, [successfulResponse]);

  useEffect(() => {
    (async () => {
      let arr = [];

      if (serverData && serverData.length > 0) {
        try {
          setLoading(true);
          arr = await Promise.all(serverData.map(async item => {
            const { publicId, entry, createdAt, updatedAt } = item;

            const passwordChunks = entry.split('.');
            const decryptedPassword = await encryptionService.decryptData(passwordChunks[1], passwordChunks[0], accessData.masterKey);

            return {
              id: publicId,
              entry: JSON.parse(decryptedPassword),
              createdAt: createdAt,
              updatedAt: updatedAt
            }
          }));

          arr.sort((a, b) => a.entry.entryTitle.toLocaleLowerCase().localeCompare(b.entry.entryTitle.toLocaleLowerCase()));
        } catch(err) {
          errorService.updateError(err);
          setLoading(false);
        }
      }

      setLoading(false);
      setDecodedData(arr);
    })();
  }, [serverData]);

  const handleAddPasswordClick = () => {
    setSuccessfulResponse(false);
    setAddFormVisible(true);
  }

  const handleShowButtonClick = e => {
    const password = decodedData.find(el => el.id === e.target.value);
    setCurrentPassword(password);
    setSuccessfulResponse(false);
    setShowFormVisible(true);
  }

  const handleEditButtonClick = e => {
    const password = decodedData.find(el => el.id === e.target.value);
    setCurrentPassword(password);
    setSuccessfulResponse(false);
    setEditFormVisible(true);
  }

  const handleDeleteButtonClick = e => {
    const password = decodedData.find(el => el.id === e.target.value);
    setCurrentPassword(password);
    setSuccessfulResponse(false);
    setConfirmationVisible(true);
  }

  const handleCancelButtonClick = () => {
    setConfirmationVisible(false);
  }

  const handleConfirmButtonClick = async () => {
    try {
      await httpClient.delete(`${urls.data}/${currentPassword.id}`);
      setConfirmationVisible(false);
      setSuccessfulResponse(true);
    } catch(err) {
      errorService.updateError(err);
    }
  }

  return (
    <div id="passwords" className="column is-10">
      { apiError && <AppError error={apiError} /> }

      {
        confirmationVisible &&
        <Confirmation
          msg={t('message', { ns: 'password' })}
          cancelButtonText={t('cancelButton', { ns: 'password' })}
          confirmButtonText={t('confirmButton', { ns: 'password' })}
          cancelCallback={handleCancelButtonClick}
          confirmCallback={handleConfirmButtonClick}
        />
      }

      {
        addFormVisible &&
        <PasswordForm
          closeCallback={setAddFormVisible}
          successCallback={setSuccessfulResponse}
          type="add"
        />
      }

      {
        editFormVisible &&
        <PasswordForm
          closeCallback={setEditFormVisible}
          successCallback={setSuccessfulResponse}
          pass={currentPassword}
          type="edit"
        />
      }

      {
        showFormVisible &&
        <PasswordForm
          closeCallback={setShowFormVisible}
          successCallback={setSuccessfulResponse}
          pass={currentPassword}
          type="show"
        />
      }

      <h1>{t('header', { ns: 'password' })}</h1>

      {
        decodedData.length > 0 &&
        <DataTable
          arr={decodedData}
          showButtonClick={handleShowButtonClick}
          editButtonClick={handleEditButtonClick}
          deleteButtonClick={handleDeleteButtonClick}
        />
      }

      <div id="add-password-icon" onClick={handleAddPasswordClick}>
        <FontAwesomeIcon icon="plus-circle" size="3x" />
      </div>
    </div>
  )
}

export default Password;

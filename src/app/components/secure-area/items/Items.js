import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HashLoader from 'react-spinners/HashLoader';

import accessService from '../../../utils/AccessService';
import encryptionService from '../../../utils/EncryptionService';
import errorService from '../../../utils/ErrorService';
import httpClient from '../../../utils/HttpClient';
import types from '../../../utils/types';
import urls from '../../../utils/urls';

import DataTable from '../../shared/data-table/DataTable';
import Confirmation from '../../shared/confirmation/Confirmation';
import AppError from '../../shared/app-error/AppError';
import AddressForm from '../address/address-form/AddressForm';
import NoteForm from '../note/note-form/NoteForm';
import PasswordForm from '../password/password-form/PasswordForm';
import SiteForm from '../site/site-form/SiteForm';

import './Items.local.scss';

const Items = () => {
  const [serverData, setServerData] = useState(null);
  const [decodedData, setDecodedData] = useState([]);
  const [successfulResponse, setSuccessfulResponse] = useState(false);
  const [currentForm, setCurrentForm] = useState(false);
  const [currentData, setCurrentData] = useState(null);
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
        const res = await httpClient.get(`${urls.data}/all`);
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
          const res = await httpClient.get(`${urls.data}/all`);
          setServerData(res.data);
        } catch(err) {
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
            const { publicId, entry, createdAt, updatedAt, type } = item;

            const dataChunks = entry.split('.');
            const decryptedData = await encryptionService.decryptData(dataChunks[1], dataChunks[0], accessData.masterKey);

            return {
              id: publicId,
              entry: JSON.parse(decryptedData),
              createdAt: createdAt,
              updatedAt: updatedAt,
              type: type
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

  const handleShowButtonClick = e => {
    const data = decodedData.find(el => el.id === e.target.value);
    let form = null;

    if (data.type === types.address) {
      form = (
        <AddressForm
          closeCallback={setCurrentForm}
          successCallback={setSuccessfulResponse}
          address={data}
          type="show"
        />
      )
    } else if (data.type === types.password) {
      form = (
        <PasswordForm
          closeCallback={setCurrentForm}
          successCallback={setSuccessfulResponse}
          pass={data}
          type="show"
        />
      )
    } else if (data.type === types.site) {
      form = (
        <SiteForm
          closeCallback={setCurrentForm}
          successCallback={setSuccessfulResponse}
          site={data}
          type="show"
        />
      )
    } else {
      form = (
        <NoteForm
          closeCallback={setCurrentForm}
          successCallback={setSuccessfulResponse}
          note={data}
          type="show"
        />
      )
    }

    setSuccessfulResponse(false);
    setCurrentForm(form);
  }

  const handleEditButtonClick = e => {
    const data = decodedData.find(el => el.id === e.target.value);
    let form = null;

    if (data.type === types.address) {
      form = (
        <AddressForm
          closeCallback={setCurrentForm}
          successCallback={setSuccessfulResponse}
          address={data}
          type="edit"
        />
      )
    } else if (data.type === types.password) {
      form = (
        <PasswordForm
          closeCallback={setCurrentForm}
          successCallback={setSuccessfulResponse}
          pass={data}
          type="edit"
        />
      )
    } else if (data.type === types.site) {
      form = (
        <SiteForm
          closeCallback={setCurrentForm}
          successCallback={setSuccessfulResponse}
          site={data}
          type="edit"
        />
      )
    } else {
      form = (
        <NoteForm
          closeCallback={setCurrentForm}
          successCallback={setSuccessfulResponse}
          note={data}
          type="edit"
        />
      )
    }

    setSuccessfulResponse(false);
    setCurrentForm(form);
  }

  const handleDeleteButtonClick = e => {
    const data = decodedData.find(el => el.id === e.target.value);
    setCurrentData(data);
    setCurrentForm(false);
    setSuccessfulResponse(false);
    setConfirmationVisible(true);
  }

  const handleCancelButtonClick = () => {
    setConfirmationVisible(false);
  }

  const handleConfirmButtonClick = async () => {
    try {
      await httpClient.delete(`${urls.data}/${currentData.id}`);
      setConfirmationVisible(false);
      setSuccessfulResponse(true);
    } catch(err) {
      errorService.updateError(err);
    }
  }



  return (
    <div id="all-items" className="column is-10">
      { apiError && <AppError error={apiError} /> }

      {
        confirmationVisible &&
        <Confirmation
          msg={t('message', { ns: 'items' })}
          cancelButtonText={t('cancelButton', { ns: 'items' })}
          confirmButtonText={t('confirmButton', { ns: 'items' })}
          cancelCallback={handleCancelButtonClick}
          confirmCallback={handleConfirmButtonClick}
        />
      }

      {
        loading &&
        <div id="spinner-wrapper">
          <HashLoader loading={loading} color={spinnerColor} size={150} />
        </div>
      }

      { currentForm }

      {
        decodedData.length > 0 &&
        <DataTable
          arr={decodedData}
          showButtonClick={handleShowButtonClick}
          editButtonClick={handleEditButtonClick}
          deleteButtonClick={handleDeleteButtonClick}
        />
      }
    </div>
  )
}

export default Items;

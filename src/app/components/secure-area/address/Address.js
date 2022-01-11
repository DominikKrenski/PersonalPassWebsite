import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HashLoader from 'react-spinners/HashLoader';

import accessService from '../../../utils/AccessService';
import sessionService from '../../../utils/SessionService';
import encryptionService from '../../../utils/EncryptionService';
import errorService from '../../../utils/ErrorService';
import httpClient from '../../../utils/HttpClient';
import types from '../../../utils/types';
import urls from '../../../utils/urls';

import AddressForm from './address-form/AddressForm';
import DataTable from '../../shared/data-table/DataTable';
import Confirmation from '../../shared/confirmation/Confirmation';
import AppError from '../../shared/app-error/AppError';

import './Address.local.scss';

const Address = () => {
  const [serverData, setServerData] = useState(null);  // raw encrypted data from server
  const [decodedData, setDecodedData] = useState([]); // decoded data
  const [successfulResponse, setSuccessfulResponse] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null); // current address for edit and show forms
  const [addFormVisible, setAddFormVisible] = useState(false); // if add address form is visible
  const [editFormVisible, setEditFormVisible] = useState(false); // if edit address form is visible
  const [showFormVisible, setShowFormVisible] = useState(false); // if show address form is visible
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [accessData, setAccessData] = useState(null); // data required for encrypt/decrypt entries
  const [apiError, setApiError] = useState(null); // error that may be throws by application
  const [loading, setLoading] = useState(false);

  const {t} = useTranslation();

  const spinnerColor = "#e20000";

  useEffect(() => {
    window.addEventListener('beforeunload', handlePageReload);

    return () => window.removeEventListener('beforeunload', handlePageReload);
  }, [accessData]);

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
        if (!accessData) {
          const restored = sessionService.get('tmp');

          if (restored) {
            await accessService.passAccessData(restored);
            sessionService.remove('tmp');
          }
        }
      } catch (err) {
        errorService.updateError(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (accessData) {
          const res = await httpClient.get(`${urls.data}?type=${types.address}`);
          setServerData(res.data);
        }
      } catch (err) {
        errorService.updateError(err);
      }
    })();
  }, [accessData]);

  useEffect(() => {
    (async () => {
      if (successfulResponse) {
        try {
          const res = await httpClient.get(`${urls.data}?type=${types.address}`);
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

            const addressChunks = entry.split('.');
            const decryptedAddress = await encryptionService.decryptData(addressChunks[1], addressChunks[0], accessData.masterKey);

            return {
              id: publicId,
              entry: JSON.parse(decryptedAddress),
              createdAt: createdAt,
              updatedAt: updatedAt
            }
          }));
        } catch (err) {
          setLoading(false);
          errorService.updateError(err);
        }

        arr.sort((a,b) => a.entry.entryTitle.toLocaleLowerCase().localeCompare(b.entry.entryTitle.toLocaleLowerCase()));

      }

      setLoading(false);
      setDecodedData(arr);
    })();
  }, [serverData]);

  const handlePageReload = e => {
    e.preventDefault();
    sessionService.set('tmp', accessData.keyHex);
  }

  const handleAddAddressClick = () => {
    setSuccessfulResponse(false);
    setAddFormVisible(true);
  }

  const handleShowButtonClick = e => {
    const address = decodedData.find(el => el.id === e.target.value);
    setCurrentAddress(address);
    setShowFormVisible(true);
  }

  const handleEditButtonClick = e => {
    const address = decodedData.find(el => el.id === e.target.value);
    setCurrentAddress(address);
    setSuccessfulResponse(false);
    setEditFormVisible(true);
  }

  const handleDeleteButtonClick = e => {
    const address = decodedData.find(el => el.id === e.target.value);
    setCurrentAddress(address);
    setSuccessfulResponse(false);
    setConfirmationVisible(true);
  }

  const handleCancelButtonClick = () => {
    setConfirmationVisible(false);
  }

  const handleConfirmButtonClick = async () => {
    try {
      await httpClient.delete(`${urls.data}/${currentAddress.id}`);
      setConfirmationVisible(false);
      setSuccessfulResponse(true);
    } catch (err) {
      errorService.updateError(err);
    }
  }



  return (
    <div id="addresses" className="column is-10">
      { apiError && <AppError error={apiError} /> }

      {
        confirmationVisible &&
        <Confirmation
          msg={t('message', { ns: 'address' })}
          cancelButtonText={t('cancelButton', { ns: 'address' })}
          confirmButtonText={t('confirmButton', { ns: 'address' })}
          cancelCallback={handleCancelButtonClick}
          confirmCallback={handleConfirmButtonClick}
        />
      }

      {
        addFormVisible &&
        <AddressForm
          closeCallback={setAddFormVisible}
          successCallback={setSuccessfulResponse}
          type="add"
        />
      }

      {
        editFormVisible &&
        <AddressForm
          closeCallback={setEditFormVisible}
          successCallback={setSuccessfulResponse}
          address={currentAddress}
          type="edit"
        />
      }

      {
        showFormVisible &&
        <AddressForm
          closeCallback={setShowFormVisible}
          successCallback={setSuccessfulResponse}
          address={currentAddress}
          type="show"
        />
      }

{
        loading &&
        <div id="spinner-wrapper">
          <HashLoader loading={loading} color={spinnerColor} size={150} />
        </div>
      }

      <h1>{t('header', { ns: 'address' })}</h1>

      {
        decodedData.length > 0 &&
        <DataTable
          arr={decodedData}
          showButtonClick={handleShowButtonClick}
          editButtonClick={handleEditButtonClick}
          deleteButtonClick={handleDeleteButtonClick}
        />
      }

      <div id="add-address-icon" onClick={handleAddAddressClick}>
        <FontAwesomeIcon icon="plus-circle" size="3x" />
      </div>
    </div>
  )
}

export default Address;

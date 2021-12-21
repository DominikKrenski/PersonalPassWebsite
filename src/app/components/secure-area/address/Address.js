import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import accessService from '../../../utils/AccessService';
import encryptionService from '../../../utils/EncryptionService';
import errorService from '../../../utils/ErrorService';
import httpClient from '../../../utils/HttpClient';
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

  const {t} = useTranslation();

  useEffect(() => {
    errorService.clearError();
    const errorSubscription = errorService.getError().subscribe(err => {setApiError(err); console.log('error service subscribed')});

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
        const res = await httpClient.get(urls.addresses);
        setServerData(res.data);
      } catch (err) {
        errorService.updateError(err);
      }
    }
    )();
  }, []);

  useEffect(() => {
    (async () => {
      if (successfulResponse) {
        try {
          const res = await httpClient.get(urls.addresses);
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
          arr = await Promise.all(serverData.map(async item => {
            const { publicId, address, createdAt, updatedAt } = item;

            const addressChunks = address.split('.');
            const decryptedAddress = await encryptionService.decryptData(addressChunks[1], addressChunks[0], accessData.masterKey);

            return {
              id: publicId,
              entry: JSON.parse(decryptedAddress),
              createdAt: createdAt,
              updatedAt: updatedAt
            }
          }));
        } catch (err) {
          errorService.updateError(err);
        }
      }

      arr.sort((a,b) => a.entry.entryTitle.toLocaleLowerCase().localeCompare(b.entry.entryTitle.toLocaleLowerCase()));
      setDecodedData(arr);
    })();
  }, [serverData]);

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
      await httpClient.delete(`${urls.addresses}/${currentAddress.id}`);
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

      <h1>Addresses</h1>

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

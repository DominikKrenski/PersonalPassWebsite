import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import accessService from '../../../utils/AccessService';
import encryptionService from '../../../utils/EncryptionService';
import errorService from '../../../utils/ErrorService';
import httpClient from '../../../utils/HttpClient';
import urls from '../../../utils/urls';

import AddressForm from './address-form/AddressForm';
import DataTable from '../../shared/data-table/DataTable';
import AppError from '../../shared/app-error/AppError';

import './Address.local.scss';

const Address = () => {
  const [serverData, setServerData] = useState(null);
  const [decodedData, setDecodedData] = useState([]);
  const [formResponse, setFormResponse] = useState(null);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [accessData, setAccessData] = useState(null);
  const [apiError, setApiError] = useState(null);

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

      setDecodedData(arr);
    })();
  }, [serverData]);

  const handleAddAddressClick = () => {
    setAddFormVisible(true);
  }

  const handleShowButtonClick = e => {
    const entry = decodedData.find(el => el.id === e.target.value);
  }

  const handleEditButtonClick = e => {
    console.log(e.target.value);
  }

  const handleDeleteButtonClick = e => {
    console.log(e.target.value);
  }



  return (
    <div id="addresses" className="column is-10">
      { apiError && <AppError error={apiError} /> }
      { addFormVisible && <AddressForm closeCallback={setAddFormVisible} successCallback={setFormResponse} /> }

      <h1>Addresses</h1>

      { decodedData.length > 0 &&
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

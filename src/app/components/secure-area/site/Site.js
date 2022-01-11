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

import SiteForm from './site-form/SiteForm';
import DataTable from '../../shared/data-table/DataTable';
import Confirmation from '../../shared/confirmation/Confirmation';
import AppError from '../../shared/app-error/AppError';

import './Site.local.scss';

const Site = () => {
  const [serverData, setServerData] = useState(null);
  const [decodedData, setDecodedData] = useState([]);
  const [successfulResponse, setSuccessfulResponse] = useState(false);
  const [currentSite, setCurrentSite] = useState(null);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [showFormVisible, setShowFormVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [accessData, setAccessData] = useState(null);
  const [apiError, setApiError] = useState(null);
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
          const res = await httpClient.get(`${urls.data}?type=${types.site}`);
          setServerData(res.data);
        }
      } catch (err) {
        errorService.updateError(err);
      }
    })();
  }, [accessData]);

  useEffect(() => {
    (async () => {
      let arr = [];

      if (serverData && serverData.length > 0) {
        try {
          setLoading(true);
          arr = await Promise.all(serverData.map(async item => {
            const { publicId, entry, createdAt, updatedAt } = item;

            const siteChunks = entry.split('.');
            const decryptedSite = await encryptionService.decryptData(siteChunks[1], siteChunks[0], accessData.masterKey);

            return {
              id: publicId,
              entry: JSON.parse(decryptedSite),
              createdAt: createdAt,
              updatedAt: updatedAt
            }
          }));

          arr.sort((a, b) => a.entry.entryTitle.toLocaleLowerCase().localeCompare(b.entry.entryTitle.toLocaleLowerCase()));
        } catch (err) {
          errorService.updateError(err);
          setLoading(false);
        }
      }

      setLoading(false);
      setDecodedData(arr);
    })();
  }, [serverData]);

  useEffect(() => {
    (async () => {
      if (successfulResponse) {
        try {
          const res = await httpClient.get(`${urls.data}?type=${types.site}`);
          setServerData(res.data);
        } catch (err) {
          errorService.updateError(err);
        }
      }
    })();
  }, [successfulResponse]);

  const handlePageReload = e => {
    e.preventDefault();
    sessionService.set('tmp', accessData.keyHex);
  }

  const handleAddSiteClick = () => {
    setSuccessfulResponse(false);
    setAddFormVisible(true);
  }

  const handleShowButtonClick = e => {
    const site = decodedData.find(el => el.id === e.target.value);
    setCurrentSite(site);
    setShowFormVisible(true);
  }

  const handleEditButtonClick = e => {
    const site = decodedData.find(el => el.id === e.target.value);
    setCurrentSite(site);
    setSuccessfulResponse(false);
    setEditFormVisible(true);
  }

  const handleDeleteButtonClick = e => {
    const site = decodedData.find(el => el.id === e.target.value);
    setCurrentSite(site);
    setSuccessfulResponse(false);
    setConfirmationVisible(true);
  }

  const handleCancelButtonClick = () => {
    setConfirmationVisible(false);
  }

  const handleConfirmButtonClick = async () => {
    try {
      await httpClient.delete(`${urls.data}/${currentSite.id}`);
      setConfirmationVisible(false);
      setSuccessfulResponse(true);
    } catch(err) {
      errorService.updateError(err);
    }
  }

  return (
    <div id="sites" className="column is-10">
      { apiError && <AppError error={apiError} /> }

      {
        confirmationVisible &&
        <Confirmation
          msg={t('message', { ns: 'site' })}
          cancelButtonText={t('cancelButton', { ns: 'site' })}
          confirmButtonText={t('confirmButton', { ns: 'site' })}
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

      {
        addFormVisible &&
        <SiteForm
          closeCallback = {setAddFormVisible}
          successCallback = {setSuccessfulResponse}
          type="add"
        />
      }

      {
        editFormVisible &&
        <SiteForm
          closeCallback={setEditFormVisible}
          successCallback={setSuccessfulResponse}
          site={currentSite}
          type="edit"
        />
      }

      {
        showFormVisible &&
        <SiteForm
          closeCallback={setShowFormVisible}
          successCallback={setSuccessfulResponse}
          site={currentSite}
          type="show"
        />
      }

      <h1>{t('header', { ns: 'site' })}</h1>

      {
        decodedData.length > 0 &&
        <DataTable
          arr={decodedData}
          showButtonClick={handleShowButtonClick}
          editButtonClick={handleEditButtonClick}
          deleteButtonClick={handleDeleteButtonClick}
        />
      }

      <div id="add-site-icon">
        <FontAwesomeIcon icon="plus-circle" size="3x" onClick={handleAddSiteClick} />
      </div>
    </div>
  )
}

export default Site;

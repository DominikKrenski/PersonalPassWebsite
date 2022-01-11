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

import DataTable from '../../shared/data-table/DataTable';
import Confirmation from '../../shared/confirmation/Confirmation';
import AppError from '../../shared/app-error/AppError';
import NoteForm from './note-form/NoteForm';

import './Note.local.scss';

const Note = () => {
  const [serverData, setServerData] = useState(null);
  const [decodedData, setDecodedData] = useState([]);
  const [successfulResponse, setSuccessfulResponse] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
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
          const res = await httpClient.get(`${urls.data}?type=${types.note}`);
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
          const res = await httpClient.get(`${urls.data}?type=${types.note}`);
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
            const { publicId, entry, createdAt, updatedAt } = item;

            const noteChunks = entry.split('.');
            const decryptedNote = await encryptionService.decryptData(noteChunks[1], noteChunks[0], accessData.masterKey);

            return {
              id: publicId,
              entry: JSON.parse(decryptedNote),
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

  const handlePageReload = e => {
    e.preventDefault();
    sessionService.set('tmp', accessData.keyHex);
  }

  const handleAddPasswordClick = () => {
    setSuccessfulResponse(false);
    setAddFormVisible(true);
  }

  const handleShowButtonClick = e => {
    const note = decodedData.find(el => el.id === e.target.value);
    setCurrentNote(note);
    setSuccessfulResponse(false);
    setShowFormVisible(true);
  }

  const handleEditButtonClick = e => {
    const note = decodedData.find(el => el.id === e.target.value);
    setCurrentNote(note);
    setSuccessfulResponse(false);
    setEditFormVisible(true);
  }

  const handleDeleteButtonClick = e => {
    const note = decodedData.find(el => el.id === e.target.value);
    setCurrentNote(note);
    setSuccessfulResponse(false);
    setConfirmationVisible(true);
  }

  const handleCancelButtonClick = () => {
    setConfirmationVisible(false);
  }

  const handleConfirmButtonClick = async () => {
    try {
      await httpClient.delete(`${urls.data}/${currentNote.id}`);
      setConfirmationVisible(false);
      setSuccessfulResponse(true);
    } catch (err) {
      errorService.updateError(err);
    }
  }

  return (
    <div id="notes" className="column is-10">
      { apiError && <AppError error={apiError} /> }

      {
        loading &&
        <div id="spinner-wrapper">
          <HashLoader loading={loading} color={spinnerColor} size={150} />
        </div>
      }

      {
        confirmationVisible &&
        <Confirmation
          msg={t('message', { ns: 'note' })}
          cancelButtonText={t('cancelButton', { ns: 'note' })}
          confirmButtonText={t('confirmButton', { ns: 'note' })}
          cancelCallback={handleCancelButtonClick}
          confirmCallback={handleConfirmButtonClick}
        />
      }

      {
        addFormVisible &&
        <NoteForm
          closeCallback={setAddFormVisible}
          successCallback={setSuccessfulResponse}
          type="add"
        />
      }

      {
        editFormVisible &&
        <NoteForm
          closeCallback={setEditFormVisible}
          successCallback={setSuccessfulResponse}
          note={currentNote}
          type="edit"
        />
      }

      {
        showFormVisible &&
        <NoteForm
          closeCallback={setShowFormVisible}
          successCallback={setSuccessfulResponse}
          note={currentNote}
          type="show"
        />
      }

      <h1>{t('header', { ns: 'note' })}</h1>

      {
        decodedData.length > 0 &&
        <DataTable
          arr={decodedData}
          showButtonClick={handleShowButtonClick}
          editButtonClick={handleEditButtonClick}
          deleteButtonClick={handleDeleteButtonClick}
        />
      }

      <div id="add-note-icon" onClick={handleAddPasswordClick}>
        <FontAwesomeIcon icon="plus-circle" size="3x" />
      </div>
    </div>
  )
}

export default Note;

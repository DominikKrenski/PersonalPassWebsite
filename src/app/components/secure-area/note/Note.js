import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import accessService from '../../../utils/AccessService';
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

  const { t } = useTranslation();

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
        const res = await httpClient.get(`${urls.data}?type=${types.note}`);
        setServerData(res.data);
      } catch(err) {
        errorService.updateError(err);
      }
    })();
  }, []);

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
          setDecodedData(arr);
        } catch(err) {
          errorService.updateError(err);
        }
      }
    })();
  }, [serverData]);

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

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import httpClient from '../../../../utils/HttpClient';
import accessService from '../../../../utils/AccessService';
import encryptionService from '../../../../utils/EncryptionService';
import errorService from '../../../../utils/ErrorService';
import useForm from '../../../../hooks/useForm';
import types from '../../../../utils/types';
import urls from '../../../../utils/urls';

import ValidationMessage from '../../../shared/validation-message/ValidationMessage';

import './NoteForm.local.scss';

const NoteForm = props => {
  const { closeCallback, successCallback, note, type } = props;

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
      ...(note.entry.entryTitle && { entryTitle: note.entry.entryTitle }),
      ...(note.entry.message && { message: note.entry.message })
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
        const encryptedNote = await encryptionService.encryptData(JSON.stringify(data), accessData.masterKey);
        await httpClient.post(
          urls.data,
          {
            entry: `${encryptedNote.vector}.${encryptedNote.encryptedData}`,
            type: types.note
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
      <h1>{t('addFormHeader', { ns: 'note_form' })}</h1>
    )

    formFooter = (
      <div className="field is-grouped is-grouped-right">
        <p className="control">
          <button className="button is-small is-rounded" onClick={handleCancelButtonClick}>
            {t('cancelButton', { ns: 'note_form' })}
          </button>
        </p>
        <p className="control">
          <button id="send-button" type="submit" className="button is-small is-rounded">
            {t('addButton', { ns: 'note_form' })}
          </button>
        </p>
      </div>
    )
  } else if (type === 'edit') {
    initialValues = setInitialValues();

    submitFunc = async data => {
      try {
        const encryptedNote = await encryptionService.encryptData(JSON.stringify(data), accessData.masterKey);
        await httpClient.put(
          `${urls.data}/${note.id}`,
          {
            entry: `${encryptedNote.vector}.${encryptedNote.encryptedData}`
          }
        );
        successCallback(true);
        closeCallback(false);
      } catch(err) {
        errorService.updateError(err);
        closeCallback(false);
      }
    }

    formHeader = (
      <h1>{t('editFormHeader', { ns: 'note_form' })}</h1>
    )

    formFooter = (
      <div className="field is-grouped is-grouped-right">
        <p className="control">
          <button className="button is-small is-rounded" onClick={handleCancelButtonClick}>
            {t('cancelButton', { ns: 'note_form' })}
          </button>
        </p>
        <p className="control">
          <button id="send-button" type="submit" className="button is-small is-rounded">
            {t('editButton', { ns: 'note_form' })}
          </button>
        </p>
      </div>
    )
  } else {
    initialValues = setInitialValues();

    formHeader = (
      <h1>{t('showFormHeader', { ns: 'note_form' })}</h1>
    )

    formFooter = (
      <div className="field is-grouped is-grouped-right">
        <button className="button is-small is-rounded" onClick={handleCancelButtonClick}>
          {t('closeButton', { ns: 'note_form' })}
        </button>
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
      message: {
        required: true,
        maxLength: 5000
      }
    },
    sanitizers: {
      entryTitle: {
        trim: true
      },
      message: {
        trim: true
      }
    }
  });

  return (
    <div id="note-form-wrapper">
      <div className="column is-half is-offset-one-quarter">
        <div id="note-form">
          <div id="form-header">
            {formHeader}
          </div>

          <form noValidate={true} autoComplete="off" onSubmit={handleSubmit(submitFunc)}>

            <div className="field">
              <label className="label" htmlFor="entryTitle">{t('entryTitleLabel', { ns: 'note_form' })}<span>*</span></label>
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
              <div className="control">
                <textarea
                  className={`textarea ${errors.message} ? "error" : ""`}
                  name="message"
                  rows={10}
                  value={data.message || ''}
                  disabled={type === 'show' ? true : false}
                  onChange={handleChange('message')}
                />
              </div>
              {
                errors.message &&
                <ValidationMessage field="message" errors={errors.message} />
              }
            </div>
            { formFooter }
          </form>
        </div>
      </div>
    </div>
  )
}

NoteForm.propTypes = {
  type: PropTypes.oneOf(['add', 'edit', 'show']).isRequired,
  successCallback: PropTypes.func.isRequired,
  closeCallback: PropTypes.func.isRequired,
  note: PropTypes.exact({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    entry: PropTypes.exact({
      entryTitle: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired
    })
  })
}

export default NoteForm;

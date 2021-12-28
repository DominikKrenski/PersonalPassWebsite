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

import './SiteForm.local.scss';

const SiteForm = props => {
  const { closeCallback, successCallback, site, type } = props;

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
      ...(site.entry.entryTitle && { entryTitle: site.entry.entryTitle }),
      ...(site.entry.url && { url: site.entry.url })
    }

    return values;
  }

  let submitFunc = null;
  let tableHeader = null;
  let tableFooter = null;
  let initialValues = {};

  if (type === 'add') {
    submitFunc = async data => {
      try {
        const encryptedSite = await encryptionService.encryptData(JSON.stringify(data), accessData.masterKey);
        await httpClient.post(
          urls.data,
          {
            entry: `${encryptedSite.vector}.${encryptedSite.encryptedData}`,
            type: types.site
          }
        );
        successCallback(true);
        closeCallback(false);
      } catch (err) {
        errorService.updateError(err);
        closeCallback(false);
      }
    }

    tableHeader = (
      <th colSpan={2}><h1>{t('addTableTitle', { ns: 'site_form' })}</h1></th>
    )

    tableFooter = (
      <tfoot>
        <tr>
          <td colSpan={2}>
            <div className="field is-grouped is-grouped-right">
              <p className="control">
                <button className="button is-small is-rounded" onClick={handleCancelButtonClick}>
                  {t('cancelButton', { ns: 'site_form' })}
                </button>
              </p>
              <p className="control">
                <button id="send-button" type="submit" className="button is-small is-rounded">
                  {t('addButton', { ns: 'site_form' })}
                </button>
              </p>
            </div>
          </td>
        </tr>
      </tfoot>
    )
  } else if (type === 'edit') {
    initialValues = setInitialValues();

    submitFunc = async data => {
      try {
        const encryptedSite = await encryptionService.encryptData(JSON.stringify(data), accessData.masterKey);
        await httpClient.put(
          `${urls.data}/${site.id}`,
          {
            entry: `${encryptedSite.vector}.${encryptedSite.encryptedData}`
          }
        );
        successCallback(true);
        closeCallback(false)
      } catch (err) {
        errorService.updateError(err);
        closeCallback(false);
      }
    }

    tableHeader = (
      <th colSpan={2}><h1>{t('editTableTitle', { ns: 'site_form' })}</h1></th>
    )

    tableFooter = (
      <tfoot>
        <tr>
          <td colSpan={2}>
            <div className="field is-grouped is-grouped-right">
              <p className="control">
                <button className="button is-small is-rounded" onClick={handleCancelButtonClick}>
                  {t('cancelButton', { ns: 'site_form' })}
                </button>
              </p>
              <p className="control">
                <button id="send-button" type="submit" className="button is-small is-rounded">
                  {t('editButton', { ns: 'site_form' })}
                </button>
              </p>
            </div>
          </td>
        </tr>
      </tfoot>
    )
  } else {
    initialValues = setInitialValues();

    tableHeader = (
      <th colSpan={2}><h1>{t('showTableTitle', { ns: 'site_form' })}</h1></th>
    )

    tableFooter = (
      <tfoot>
        <tr>
          <td colSpan={2}>
            <div className="field is-grouped is-grouped-right">
              <p className="control">
                <button className="button is-small is-rounded" onClick={handleCancelButtonClick}>
                  {t('closeButton', { ns: 'site_form' })}
                </button>
              </p>
            </div>
          </td>
        </tr>
      </tfoot>
    )
  }

  const [handleChange, handleSubmit, data, errors] = useForm({
    ...(Object.keys(initialValues) && { 'initialValues': initialValues }),
    validators: {
      entryTitle: {
        required: true,
        maxLength: 100
      },
      url: {
        required: true,
        maxLength: 2048
      }
    },
    sanitizers: {
      entryTitle: {
        trim: true
      },
      url: {
        trim: true
      }
    }
  });

  return (
    <div id="site-form-wrapper">
      <div className="column is-half is-offset-one-quarter">
        <div id="site-form">
          <form noValidate={true} autoComplete="off" onSubmit={handleSubmit(submitFunc)}>
            <table className="table is-bordered is-fullwidth is-striped">
              <thead>
                <tr>
                  {tableHeader}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t('entryTitle', { ns: 'site_form' })} <span>*</span></td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className={`input ${errors.entryTitle ? "error": ""}`}
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
                  </td>
                </tr>
                <tr>
                  <td>URL <span>*</span></td>
                  <td>
                    <div className="field">
                      <div className="control">
                        <input
                          className={`input ${errors.url ? "error" : ""}`}
                          type="text"
                          name="url"
                          value={data.url || ''}
                          disabled={type === 'show' ? true : false}
                          onChange={handleChange('url')}
                        />
                      </div>
                      {
                        errors.url &&
                        <ValidationMessage field="url" errors={errors.url} />
                      }
                    </div>
                  </td>
                </tr>
              </tbody>
              {tableFooter}
            </table>
          </form>
        </div>
      </div>
    </div>
  )
}

SiteForm.propTypes = {
  type: PropTypes.oneOf(['add', 'edit', 'show']).isRequired,
  successCallback: PropTypes.func.isRequired,
  closeCallback: PropTypes.func.isRequired,
  site: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    entry: PropTypes.exact({
      entryTitle: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  })
}

export default SiteForm;

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import urls from '../../../utils/urls';
import accessService from '../../../utils/AccessService';
import errorService from '../../../utils/ErrorService';
import httpClient from '../../../utils/HttpClient';
import i18n from '../../../i18n';

import AppError from '../../shared/app-error/AppError';

import './Account.local.scss';

const Account = () => {
  const [accountData, setAccountData] = useState(null);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [apiError, setApiError] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        await accessService.passAccessData();
        const res = await httpClient.get(urls.accountDetails);
        console.log(res);
        setAccountData(res.data);
      } catch (err) {
        console.log('Account useEffect catch');
        errorService.updateError(err);
      }
    })();
  }, []);

  useEffect(() => {
    errorService.clearError();
    const errorSubscription = errorService.getError().subscribe(err => setApiError(err));

    return () => errorSubscription.unsubscribe();
  }, []);

  const handleShowReminderClick = () => {
    if (reminderVisible) {
      setReminderVisible(false);
    } else {
      setReminderVisible(true);
    }
  }

  const handleLanguageChange = e => {
    i18n.changeLanguage(e.target.value);
  }

  return (
    <div id="account-details" className="column is-10">
      { apiError && <AppError error={apiError} /> }

      <h1>{t('account.header')}</h1>

      <table className="table is-bordered is-fullwidth">
        <thead>
          <tr>
            <th colSpan={2}>{t('account.loginTable.header')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t('account.loginTable.emailAccount')}</td>
            <td>
              <div className="text-with-button">
              <span>{accountData ? accountData.email : ''}</span> <button className="button is-outlined is-primary is-small">{t('account.loginTable.buttons.changeEmail')}</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>{t('account.loginTable.masterPassword')}</td>
            <td><button className="button is-outlined is-primary is-small">{t('account.loginTable.buttons.changeMasterPassword')}</button></td>
          </tr>
          <tr>
            <td>{t('account.loginTable.masterPasswordReminder')}</td>
            <td>
              <div className="text-with-button">
                <span className={reminderVisible ? 'reminder-visible' : 'reminder-invisible'}>
                  {accountData ? accountData.reminder : ''}
                </span>
                <button
                  onClick={handleShowReminderClick}
                  className="button is-outlined is-primary is-small"
                >
                    {reminderVisible ? t('account.loginTable.buttons.masterPassReminderVisible') : t('account.loginTable.buttons.masterPassReminderHidden')}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table id="account-info-table" className="table is-bordered is-fullwidth">
        <thead>
          <tr>
            <th colSpan={2}>{t('account.infoTable.header')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t('account.infoTable.createdAt')}</td>
            <td>{accountData ? accountData.createdAt : ''}</td>
          </tr>
          <tr>
            <td>{t('account.infoTable.updatedAt')}</td>
            <td>{accountData ? accountData.updatedAt : ''}</td>
          </tr>
          <tr>
            <td>{t('account.infoTable.language')}</td>
            <td>
              <div className="select is-success">
                <select value={i18n.language} onChange={handleLanguageChange}>
                  <option value="en">{t('account.infoTable.langSelect.en')}</option>
                  <option value="pl">{t('account.infoTable.langSelect.pl')}</option>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>{t('account.infoTable.timeZone')}</td>
            <td>Select</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Account;

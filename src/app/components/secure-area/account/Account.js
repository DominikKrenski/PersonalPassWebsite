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

  const handleTimeZoneChange = e => {
    console.log(e.target.value);
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
              <div className="select is-success is-small">
                <select value={i18n.language} onChange={handleLanguageChange}>
                  <option value="en">{t('account.infoTable.langSelect.en')}</option>
                  <option value="pl">{t('account.infoTable.langSelect.pl')}</option>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>{t('account.infoTable.timeZone')}</td>
            <td>
              <div className="select is-success is-small">
                <select onChange={handleTimeZoneChange}>
                  <option value="-12">(-12:00) {t('timeZones.0')}</option>
                  <option value="-11">(-11:00) {t('timeZones.1')}</option>
                  <option value="-10">(-10:00) {t('timeZones.2')}</option>
                  <option value="-9">(-09:00) {t('timeZones.3')}</option>
                  <option value="-8">(-08:00) {t('timeZones.4')}</option>
                  <option value="-7">(-07:00) {t('timeZones.5')}</option>
                  <option value="-6">(-06:00) {t('timeZones.6')}</option>
                  <option value="-5">(-05:00) {t('timeZones.7')})</option>
                  <option value="-4">(-04:00) {t('timeZones.8')}</option>
                  <option value="-3">(-03:00) {t('timeZones.9')}</option>
                  <option value="-2">(-02:00) {t('timeZones.10')}</option>
                  <option value="-1">(-01:00) {t('timeZones.11')}</option>
                  <option value="0">(0:00) {t('timeZones.12')}</option>
                  <option value="1">(+01:00) {t('timeZones.13')}</option>
                  <option value="2">(+02:00) {t('timeZones.14')}</option>
                  <option value="3">(+03:00) {t('timeZones.15')}</option>
                  <option value="4">(+04:00) {t('timeZones.16')}</option>
                  <option value="5">(+05:00) {t('timeZones.17')}</option>
                  <option value="6">(+06:00) {t('timeZones.18')}</option>
                  <option value="7">(+07:00) {t('timeZones.19')}</option>
                  <option value="8">(+08:00) {t('timeZones.20')}</option>
                  <option value="9">(+09:00) {t('timeZones.21')}</option>
                  <option value="10">(+10:00) {t('timeZones.22')}</option>
                  <option value="11">(+11:00) {t('timeZones.23')}</option>
                  <option value="12">(+12:00) {t('timeZones.24')}</option>
                  <option value="13">(+13:00) {t('timeZones.25')}</option>
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Account;

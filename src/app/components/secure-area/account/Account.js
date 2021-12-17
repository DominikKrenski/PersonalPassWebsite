import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import urls from '../../../utils/urls';
import accessService from '../../../utils/AccessService';
import localService from '../../../utils/LocalService';
import dateService from '../../../utils/DateService';
import errorService from '../../../utils/ErrorService';
import httpClient from '../../../utils/HttpClient';
import i18n from '../../../i18n';

import EmailUpdateForm from '../../shared/email-update-form/EmailUpdateForm';
import AppInfo from '../../shared/app-info/AppInfo';
import AppError from '../../shared/app-error/AppError';

import './Account.local.scss';

const Account = () => {
  const [accountData, setAccountData] = useState(null);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [currentTimeZone, setCurrentTimeZone] = useState(null);
  const [emailFormVisible, setEmailFormVisible] = useState(null);
  const [appInfoVisible, setAppInfoVisible] = useState(false);
  const [apiError, setApiError] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        await accessService.passAccessData();
        const res = await httpClient.get(urls.accountDetails);
        setAccountData(res.data);
      } catch (err) {
        errorService.updateError(err);
      }
    })();
  }, []);

  useEffect(() => {
    errorService.clearError();
    const errorSubscription = errorService.getError().subscribe(err => setApiError(err));
    const tz = localService.get('timezone');

    if (tz) {
      setCurrentTimeZone(tz);
    } else {
      localService.set('timezone', 'Europe/London');
      setCurrentTimeZone('Europe/London');
    }

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
    localService.set('timezone', e.target.value);
    setCurrentTimeZone(e.target.value);
  }

  const handleUpdateEmailClick = () => {
    setEmailFormVisible({
      initialValue: accountData?.email,
      successCallback: setAccountData,
      closeCallback: setEmailFormVisible
    });
  }

  const handleSendTestEmailClick = async () => {
    try {
      await httpClient.get(urls.testEmail);
      setAppInfoVisible(true);
    } catch (err) {
      errorService.updateError(err);
    }
  }

  return (
    <div id="account-details" className="column is-10">
      { emailFormVisible && <EmailUpdateForm opts={emailFormVisible} /> }

      { appInfoVisible && <AppInfo msg={t('appInfo.message', { ns: 'account' })} closeCallback={setAppInfoVisible}/> }

      { apiError && <AppError error={apiError} /> }

      <h1>{t('header', { ns: 'header' })}</h1>

      <table className="table is-bordered is-fullwidth">
        <thead>
          <tr>
            <th colSpan={2}>{t('loginTable.header', { ns: 'account' })}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t('loginTable.emailAccount', { ns: 'account' })}</td>
            <td>
              <div className="text-with-button">
              <span>{accountData ? accountData.email : ''}</span>
              <button
                className="button is-outlined is-primary is-small"
                onClick={handleUpdateEmailClick}
              >
                {t('loginTable.buttons.changeEmail', { ns: 'account' })}
              </button>

              <span style={{marginRight: "15px"}}></span>

              <button
                className="button is-outlined is-primary is-small"
                onClick={handleSendTestEmailClick}
              >
                {t('loginTable.buttons.sendTestEmail', { ns: 'account' })}
              </button>
              </div>
            </td>
          </tr>
          <tr>
            <td>{t('loginTable.masterPassword', { ns: 'account' })}</td>
            <td>
              <button
                className="button is-outlined is-primary is-small"
                >
                  {t('loginTable.buttons.changeMasterPassword', { ns: 'account' })}
                </button>
            </td>
          </tr>
          <tr>
            <td>{t('loginTable.masterPasswordReminder', { ns: 'account' })}</td>
            <td>
              <div className="text-with-button">
                <span className={reminderVisible ? 'reminder-visible' : 'reminder-invisible'}>
                  {accountData ? accountData.reminder : ''}
                </span>

                <button
                  onClick={handleShowReminderClick}
                  className="button is-outlined is-primary is-small"
                >
                    {reminderVisible ? t('loginTable.buttons.masterPassReminderVisible', { ns: 'account' }) : t('loginTable.buttons.masterPassReminderHidden', { ns: 'account' })}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table id="account-info-table" className="table is-bordered is-fullwidth">
        <thead>
          <tr>
            <th colSpan={2}>{t('infoTable.header', { ns: 'account' })}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t('infoTable.createdAt', { ns: 'account' })}</td>
            <td>{accountData ? dateService.displayDate(accountData.createdAt, currentTimeZone) : ''}</td>
          </tr>
          <tr>
            <td>{t('infoTable.updatedAt', { ns: 'account' })}</td>
            <td>{accountData ? dateService.displayDate(accountData.updatedAt, currentTimeZone) : ''}</td>
          </tr>
          <tr>
            <td>{t('infoTable.language', { ns: 'account' })}</td>
            <td>
              <div className="select is-success is-small">
                <select value={i18n.language} onChange={handleLanguageChange}>
                  <option value="en">{t('infoTable.langSelect.en', { ns: 'account' })}</option>
                  <option value="pl">{t('infoTable.langSelect.pl', { ns: 'account' })}</option>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>{t('infoTable.timeZone', { ns: 'account' })}</td>
            <td>
              <div className="select is-success is-small">
                <select value={currentTimeZone || 'Europe/London'} onChange={handleTimeZoneChange}>
                  <option value="Pacific/Fiji">(-12:00) {t('timeZones.0', { ns: 'account' })}</option>
                  <option value="US/Samoa">(-11:00) {t('timeZones.1', { ns: 'account' })}</option>
                  <option value="US/Hawaii">(-10:00) {t('timeZones.2', { ns: 'account' })}</option>
                  <option value="US/Alaska">(-09:00) {t('timeZones.3', { ns: 'account' })}</option>
                  <option value="US/Pacific">(-08:00) {t('timeZones.4', { ns: 'account' })}</option>
                  <option value="US/Arizona">(-07:00) {t('timeZones.5', { ns: 'account' })}</option>
                  <option value="US/Central">(-06:00) {t('timeZones.6', { ns: 'account' })}</option>
                  <option value="US/Eastern">(-05:00) {t('timeZones.7', { ns: 'account' })})</option>
                  <option value="Canada/Atlantic">(-04:00) {t('timeZones.8', { ns: 'account' })}</option>
                  <option value="Brazil/East">(-03:00) {t('timeZones.9', { ns: 'account' })}</option>
                  <option value="Brazil/DeNoronha">(-02:00) {t('timeZones.10', { ns: 'account' })}</option>
                  <option value="Atlantic/Azores">(-01:00) {t('timeZones.11', { ns: 'account' })}</option>
                  <option value="Europe/London">(0:00) {t('timeZones.12', { ns: 'account' })}</option>
                  <option value="Europe/Brussels">(+01:00) {t('timeZones.13', { ns: 'account' })}</option>
                  <option value="Europe/Athens">(+02:00) {t('timeZones.14', { ns: 'account' })}</option>
                  <option value="Europe/Moscow">(+03:00) {t('timeZones.15', { ns: 'account' })}</option>
                  <option value="Asia/Tbilisi">(+04:00) {t('timeZones.16', { ns: 'account' })}</option>
                  <option value="Asia/Yekaterinburg">(+05:00) {t('timeZones.17', { ns: 'account' })}</option>
                  <option value="Asia/Novosibirsk">(+06:00) {t('timeZones.18', { ns: 'account' })}</option>
                  <option value="Asia/Krasnoyarsk">(+07:00) {t('timeZones.19', { ns: 'account' })}</option>
                  <option value="Asia/Irkutsk">(+08:00) {t('timeZones.20', { ns: 'account' })}</option>
                  <option value="Asia/Yakutsk">(+09:00) {t('timeZones.21', { ns: 'account' })}</option>
                  <option value="Australia/Canberra">(+10:00) {t('timeZones.22', { ns: 'account' })}</option>
                  <option value="Asia/Magadan">(+11:00) {t('timeZones.23', { ns: 'account' })}</option>
                  <option value="Pacific/Auckland">(+12:00) {t('timeZones.24', { ns: 'account' })}</option>
                </select>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={2}><button id="delete-account-button" className="button is-small">{t('infoTable.deleteButton', { ns: 'account' })}</button></th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default Account;

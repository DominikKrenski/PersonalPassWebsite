import { useEffect, useState } from 'react';

import urls from '../../../utils/urls';
import accessService from '../../../utils/AccessService';
import errorService from '../../../utils/ErrorService';
import httpClient from '../../../utils/HttpClient';

import './Account.local.scss';
import AppError from '../../shared/app-error/AppError';

const Account = () => {
  const [accountData, setAccountData] = useState(null);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [apiError, setApiError] = useState(null);

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
    console.log(e.target.value);
    setCurrentLanguage(e.target.value);
  }

  return (
    <div id="account-details" className="column is-10">
      { apiError && <AppError error={apiError} /> }

      <h1>Account Settings</h1>

      <table className="table is-bordered is-fullwidth">
        <thead>
          <tr>
            <th colSpan={2}>Login Credentials</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Account Email</td>
            <td>
              <div className="text-with-button">
              <span>{accountData ? accountData.email : ''}</span> <button className="button is-outlined is-primary is-small">Change email</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>Master Password</td>
            <td><button className="button is-outlined is-primary is-small">Change Master Password</button></td>
          </tr>
          <tr>
            <td>Master Password Reminder</td>
            <td>
              <div className="text-with-button">
                <span className={reminderVisible ? 'reminder-visible' : 'reminder-invisible'}>
                  {accountData ? accountData.reminder : ''}
                </span>
                <button
                  onClick={handleShowReminderClick}
                  className="button is-outlined is-primary is-small"
                >
                    {reminderVisible ? 'Hide reminder' : 'Show reminder'}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <h1>Account Information</h1>
      <table className="table is-bordered is-fullwidth">
        <thead>
          <tr>
            <th colSpan={2}>Account Information</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Created At</td>
            <td>{accountData ? accountData.createdAt : ''}</td>
          </tr>
          <tr>
            <td>Last Modified At</td>
            <td>{accountData ? accountData.updatedAt : ''}</td>
          </tr>
          <tr>
            <td>Language</td>
            <td>
              <div className="select is-success" value={currentLanguage} onChange={handleLanguageChange}>
                <select>
                  <option value="english">English</option>
                  <option value="polish">Polish</option>
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>Time Zone</td>
            <td>Select</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Account;

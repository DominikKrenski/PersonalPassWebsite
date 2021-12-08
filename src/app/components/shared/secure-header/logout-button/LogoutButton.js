import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import httpClient from '../../../../utils/HttpClient';
import errorService from '../../../../utils/ErrorService';
import accessService from '../../../../utils/AccessService';
import urls from '../../../../utils/urls';

import './LogoutButton.local.scss';

const LogoutButton = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleLogoutButtonClick = async () => {
    try {
      await httpClient.get(urls.signout);
    } catch (err) {
      errorService.updateError(err);
    } finally {
      await accessService.deleteAllAccessData();
      history.push('/');
    }
  }

  return (
    <div id="logout-button-wrapper" className="column is-4">
      <button
        id="logout-button"
        className="button is-rounded"
        onClick={handleLogoutButtonClick}
      >
        {t('secureArea.logoutButton')}
      </button>
    </div>
  )
}

export default LogoutButton;

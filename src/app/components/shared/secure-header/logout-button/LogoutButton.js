import { useTranslation } from 'react-i18next';

import './LogoutButton.local.scss';

const LogoutButton = () => {
  const { t } = useTranslation();

  return (
    <div id="logout-button-wrapper" className="column is-4">
      <button id="logout-button" className="button is-rounded">{t('secureArea.logoutButton')}</button>
    </div>
  )
}

export default LogoutButton;

import { Link, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './SecureNav.local.scss';

const SecureNav = () => {
  const { url } = useRouteMatch();
  const { t } = useTranslation();

  return (
    <aside id="secure-nav" className="menu column is-2">
      <ul className="menu-list">
        <li>
          <Link to={`${url}`}>
            <span><FontAwesomeIcon icon="home" size="lg" /></span>
            {t('secureNav.allItems')}
          </Link>
        </li>
        <li>
          <Link to={`${url}/password`}>
            <span><FontAwesomeIcon icon="lock" size="lg" /></span>
            {t('secureNav.passwords')}
          </Link>
        </li>
        <li>
          <Link to={`${url}/addresses`}>
            <span><FontAwesomeIcon icon="address-book" size="lg" /></span>
            {t('secureNav.addresses')}
          </Link>
        </li>
        <li>
          <Link to={`${url}/websites`}>
            <span><FontAwesomeIcon icon="rss-square" size="lg" /></span>
            {t('secureNav.websites')}
          </Link>
        </li>
        <li>
          <Link to={`${url}/notes`}>
            <span><FontAwesomeIcon icon="sticky-note" size="lg" /></span>
             {t('secureNav.notes')}
            </Link>
        </li>
        <li id="last-item">
          <Link to={`${url}/account`}>
            <span><FontAwesomeIcon icon="cog" size="lg" /></span>
            {t('secureNav.account')}
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default SecureNav;

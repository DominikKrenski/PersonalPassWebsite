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
            {t('allItems', { ns: 'secure_nav' })}
          </Link>
        </li>
        <li>
          <Link to={`${url}/password`}>
            <span><FontAwesomeIcon icon="lock" size="lg" /></span>
            {t('passwords', { ns: 'secure_nav' })}
          </Link>
        </li>
        <li>
          <Link to={`${url}/address`}>
            <span><FontAwesomeIcon icon="address-book" size="lg" /></span>
            {t('addresses', { ns: 'secure_nav' })}
          </Link>
        </li>
        <li>
          <Link to={`${url}/website`}>
            <span><FontAwesomeIcon icon="rss-square" size="lg" /></span>
            {t('websites', { ns: 'secure_nav' })}
          </Link>
        </li>
        <li>
          <Link to={`${url}/note`}>
            <span><FontAwesomeIcon icon="sticky-note" size="lg" /></span>
             {t('notes', { ns: 'secure_nav' })}
            </Link>
        </li>
        <li id="last-item">
          <Link to={`${url}/account`}>
            <span><FontAwesomeIcon icon="cog" size="lg" /></span>
            {t('account', { ns: 'secure_nav' })}
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default SecureNav;

import { Link, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './SecureNav.local.scss';

const SecureNav = () => {
  const { url } = useRouteMatch();

  return (
    <aside id="secure-nav" className="menu column is-2">
      <ul className="menu-list">
        <li>
          <Link to={`${url}`}>
            <span><FontAwesomeIcon icon="home" size="lg" /></span>
            All Items
          </Link>
        </li>
        <li>
          <Link to={`${url}/password`}>
            <span><FontAwesomeIcon icon="lock" size="lg" /></span>
            Passwords
          </Link>
        </li>
        <li>
          <Link to={`${url}/addresses`}>
            <span><FontAwesomeIcon icon="address-book" size="lg" /></span>
            Addresses
          </Link>
        </li>
        <li>
          <Link to={`${url}/websites`}>
            <span><FontAwesomeIcon icon="rss-square" size="lg" /></span>
            Websites
          </Link>
        </li>
        <li>
          <Link to={`${url}/notes`}>
            <span><FontAwesomeIcon icon="sticky-note" size="lg" /></span>
             Notes
            </Link>
        </li>
        <li id="last-item">
          <Link to={`${url}/account`}>
            <span><FontAwesomeIcon icon="cog" size="lg" /></span>
            Account
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default SecureNav;

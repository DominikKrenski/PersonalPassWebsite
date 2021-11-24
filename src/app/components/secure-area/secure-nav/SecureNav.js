import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './SecureNav.local.scss';

const SecureNav = () => {
  return (
    <aside id="secure-nav" className="menu column is-3">
      <ul className="menu-list">
        <li>
          <a>
            <span><FontAwesomeIcon icon="home" size="lg" /></span>
            All Items
          </a>
        </li>
        <li>
          <a>
            <span><FontAwesomeIcon icon="lock" size="lg" /></span>
            Passwords
          </a>
        </li>
        <li>
          <a>
            <span><FontAwesomeIcon icon="address-book" size="lg" /></span>
            Addresses
          </a>
        </li>
        <li>
          <a>
            <span><FontAwesomeIcon icon="rss-square" size="lg" /></span>
            Websites
          </a>
        </li>
        <li>
          <a>
            <span><FontAwesomeIcon icon="sticky-note" size="lg" /></span>
             Notes
            </a>
        </li>
        <li id="last-item">
          <a>
            <span><FontAwesomeIcon icon="cog" size="lg" /></span>
            Account
          </a>
        </li>
      </ul>
    </aside>
  )
}

export default SecureNav;

import { useState } from 'react';
import { Link } from 'react-router-dom';

import './HomeNavigation.local.scss';

const HomeNavigation = () => {
  const [burgerActive, toggleBurgerActive] = useState(false);

  const handleBurgerClick = () => {
    if (burgerActive) {
      toggleBurgerActive(false);
    } else {
      toggleBurgerActive(true);
    }
  }

  return (
    <nav id="home-nav" className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">Personal<span>Pass</span></Link>
        <Link to="#"
          role="button"
          className={`navbar-burger ${burgerActive ? 'is-active' : ''}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="homeNavigation"
          onClick={handleBurgerClick}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </Link>
      </div>

      <div
        id="homeNavigation"
        className={`navbar-menu ${burgerActive ? 'is-active' : ''}`}
      >
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <Link to="/signin" className="button is-rounded is-inverted is-primary">SIGN IN</Link>
              <Link to="/signup" className="button is-rounded">CREATE AN ACCOUNT</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default HomeNavigation;

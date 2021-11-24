import SecureLogo from './secure-logo/SecureLogo';
import AppCounter from '../app-counter/AppCounter';
import LogoutButton from './logout-button/LogoutButton';

import './SecureHeader.local.scss';

const SecureHeader = () => {
  return (
    <div id="secure-header" className="columns is-vcentered">
      <SecureLogo />
      <AppCounter />
      <LogoutButton />
    </div>
  )
}

export default SecureHeader;

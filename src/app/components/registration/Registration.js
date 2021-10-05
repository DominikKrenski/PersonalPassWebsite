import RegistrationForm from './registration-form/RegistrationForm';
import AppHeader from '../shared/app-header/AppHeader';
import AppFooter from '../shared/app-footer/AppFooter';

import './Registration.local.scss';

const Registration = () => {
  return (
    <div id="registration" className="columns is-multiline">
      <AppHeader />
      <RegistrationForm />
      <AppFooter />
    </div>
  )
}

export default Registration;
import { useState, useEffect } from 'react';

import RegistrationForm from './registration-form/RegistrationForm';
import AppHeader from '../shared/app-header/AppHeader';
import AppFooter from '../shared/app-footer/AppFooter';
import AppError from '../shared/app-error/AppError';

import errorService from '../../utils/ErrorService';

import './Registration.local.scss';

const Registration = () => {
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    errorService.clearError();
    const errorServiceSubscription = errorService.getError().subscribe(err => setApiError(err));

    return () => errorServiceSubscription.unsubscribe();
  }, []);

  return (
    <div id="registration" className="columns is-multiline">
      <AppHeader />
      {apiError && <AppError error={apiError} />}
      <RegistrationForm />
      <AppFooter />
    </div>
  )
}

export default Registration;

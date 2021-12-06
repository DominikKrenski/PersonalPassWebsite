import { useState, useEffect } from 'react';

import AppHeader from '../shared/app-header/AppHeader';
import PasswordHintForm from './password-hint-form/PasswordHintForm';
import AppFooter from '../shared/app-footer/AppFooter';
import AppError from '../shared/app-error/AppError';

import errorService from '../../utils/ErrorService';

import './PasswordHint.local.scss';

const PasswordHint = () => {
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    errorService.clearError();

    const errorServiceSubscription = errorService.getError().subscribe(err => setApiError(err));

    return () => errorServiceSubscription.unsubscribe();
  }, []);

  return (
    <div id="password-hint" className="columns is-multiline">
      <AppHeader />
      { apiError && <AppError error={apiError} /> }
      <PasswordHintForm />
      <AppFooter />
    </div>
  )
}

export default PasswordHint;

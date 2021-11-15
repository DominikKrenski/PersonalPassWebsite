import { useState, useEffect } from 'react';

import LoginForm from './login-form/LoginForm';
import AppHeader from '../shared/app-header/AppHeader';
import AppFooter from '../shared/app-footer/AppFooter';
import AppError from '../shared/app-error/AppError';

import errorService from '../../utils/ErrorService';

import './Login.local.scss';

const Login = () => {
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const errorServiceSubscription = errorService.getError().subscribe(err => setApiError(err));

    return () => errorServiceSubscription.unsubscribe();
  })

  return (
    <div id="login" className="columns is-multiline">
      <AppHeader />
      { apiError && <AppError error={apiError} /> }
      <LoginForm />
      <AppFooter />
    </div>
  )
}

export default Login;

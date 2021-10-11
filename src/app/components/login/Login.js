import LoginForm from './login-form/LoginForm';
import AppHeader from '../shared/app-header/AppHeader';
import AppFooter from '../shared/app-footer/AppFooter';

import './Login.local.scss';

const Login = () => {
  return (
    <div id="login" className="columns is-multiline">
      <AppHeader />
      <LoginForm />
      <AppFooter />
    </div>
  )
}

export default Login;

import { Suspense } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faLock,
  faEnvelope,
  faEye,
  faStickyNote,
  faEyeSlash,
  faCircle,
  faCheckCircle,
  faExclamationCircle,
  faAddressBook,
  faRssSquare,
  faHome,
  faCog,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

import Home from './components/home/Home';
import Registration from './components/registration/Registration';
import Login from './components/login/Login';
import PasswordHint from './components/password-hint/PasswordHint';
import SecureArea from './components/secure-area/SecureArea';
import SecureRoute from './guards/SecureRoute';

import './App.scss';

library.add(
  faLock,
  faEnvelope,
  faEye,
  faStickyNote,
  faEyeSlash,
  faCircle,
  faCheckCircle,
  faExclamationCircle,
  faAddressBook,
  faRssSquare,
  faHome,
  faCog,
  faTimesCircle
  );

const App = () => {
  return (
    <Suspense fallback="loading">
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/signup">
          <Registration />
        </Route>
        <Route path="/signin">
          <Login />
        </Route>
        <Route path="/password-hint">
          <PasswordHint />
        </Route>
        <SecureRoute path="/secure">
          <SecureArea />
        </SecureRoute>
      </Switch>
    </Router>
    </Suspense>
  )
}

export default App;

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
import SecureArea from './components/secure-area/SecureArea';

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
        <Route path="/secure">
          <SecureArea />
        </Route>
      </Switch>
    </Router>
    </Suspense>
  )
}

export default App;

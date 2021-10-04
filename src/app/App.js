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
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';

import Home from './components/home/Home';
import Registration from './components/registration/Registration';

import './App.scss';

library.add(faLock, faEnvelope, faEye, faStickyNote, faEyeSlash);

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/signup">
          <Registration />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;

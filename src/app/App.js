import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import Home from './components/home/Home';
import Registration from './components/registration/Registration';

import './App.scss';

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

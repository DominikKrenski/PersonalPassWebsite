import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer';

import timerService from '../../utils/TimerService';

import SecureHeader from '../shared/secure-header/SecureHeader';
import SecureNav from './secure-nav/SecureNav';
import AppFooter from '../shared/app-footer/AppFooter';
import Items from './items/Items';
import Account from './account/Account';
import Address from './address/Address';
import Site from './site/Site';
import Password from './password/Password';
import Note from './note/Note';

import './SecureArea.local.scss';

const SecureArea = () => {
  const { path } = useRouteMatch();

  const handleOnAction = event => {
    timerService.activityDetected(true);
  }

  useIdleTimer({
    onAction: handleOnAction
  });

  return (
    <div id="secure-area">
      <SecureHeader />
      <div id="content-area" className="columns is-mobile">
      <SecureNav />
        <Switch>
          <Route exact path={path}>
            <Items />
          </Route>
          <Route path={`${path}/account`}>
            <Account />
          </Route>
          <Route path={`${path}/address`}>
            <Address />
          </Route>
          <Route path={`${path}/website`}>
            <Site />
          </Route>
          <Route path={`${path}/password`}>
            <Password />
          </Route>
          <Route path={`${path}/note`}>
            <Note />
          </Route>
        </Switch>
      </div>
      <AppFooter />
    </div>
  )
}

export default SecureArea;

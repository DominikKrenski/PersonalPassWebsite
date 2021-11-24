import { useIdleTimer } from 'react-idle-timer';

import timerService from '../../utils/TimerService';

import SecureHeader from '../shared/secure-header/SecureHeader';

import './SecureArea.local.scss';

const SecureArea = () => {
  const handleOnAction = event => {
    timerService.activityDetected(true);
  }

  useIdleTimer({
    onAction: handleOnAction
  });

  return (
    <div id="secure-area">
      <SecureHeader />
    </div>
  )
}

export default SecureArea;

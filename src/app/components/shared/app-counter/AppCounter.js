import { useState, useEffect } from 'react';

import timerService from '../../../utils/TimerService';

import './AppCounter.local.scss';

const AppCounter = () => {
  const [min, setMin] = useState(1);
  const [sec, setSec] = useState(50);

  useEffect(() => {
    const subscription = timerService.getActivity().subscribe(activity => {
      if (activity) {
        setMin(1);
        setSec(50);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (sec > 0) {
        setSec(prev => prev - 1);
      } else {
        if (min === 1) {
          setMin(prev => prev - 1);
          setSec(59);
        }
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [sec]);

  return (
    <div id="app-counter" className="column is-4">
      <p>Your session expires in: {min}:{sec.toString().padStart(2, '0')}</p>
    </div>
  )
}

export default AppCounter;

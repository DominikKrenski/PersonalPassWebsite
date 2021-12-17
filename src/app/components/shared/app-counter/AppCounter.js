import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

import httpClient from '../../../utils/HttpClient';
import accessService from '../../../utils/AccessService';
import errorService from '../../../utils/ErrorService';
import timerService from '../../../utils/TimerService';
import urls from '../../../utils/urls';

import './AppCounter.local.scss';

const AppCounter = () => {
  const [min, setMin] = useState(1);
  const [sec, setSec] = useState(50);
  const [finished, setFinished] = useState(false);

  const { t } = useTranslation();
  const history = useHistory();

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
      if (min === 0 && sec === 0) {
        setFinished(true);
      }

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

  useEffect(() => {
    (async () => {
      if (finished) {
        try {
          await httpClient.get(urls.signout);
        } catch (err) {
          errorService.updateError(err);
        } finally {
          await accessService.deleteAllAccessData();
          history.push('/');
        }
      }
    })();
  }, [finished]);

  return (
    <div id="app-counter" className="column is-4">
      <p>{t('text', { ns: 'app_counter' })}: {min}:{sec.toString().padStart(2, '0')}</p>
    </div>
  )
}

export default AppCounter;

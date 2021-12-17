import { useTranslation } from 'react-i18next';

import './HomeInfo.local.scss';

const HomeInfo = () => {
  const { t } = useTranslation();

  return (
    <section id="home-info" className="columns is-multiline">
      <div className="column is-two-fifhts">
        <div className="info-title">
          <p>{t('algorithm.title', { ns: 'home_info' })}</p>
        </div>
        <div className="info-text">
          <p>{t('algorithm.text', { ns: 'home_info' })}</p>
        </div>
      </div>

      <div className="column is-two-fifths is-offset-one-fifth">
        <div className="info-title">
          <p>{t('encryption.title', { ns: 'home_info' })}</p>
        </div>
        <div className="info-text">
          <p>{t('encryption.text', { ns: 'home_info' })}</p>
        </div>
      </div>

      <div className="column is-two-fifths">
        <div className="info-title">
          <p>{t('openSource.title', { ns: 'home_info' })}</p>
        </div>
        <div className="info-text">
          <p>{t('openSource.text', { ns: 'home_info' })}</p>
        </div>
      </div>

      <div className="column is-two-fifhts is-offset-one-fifth">
        <div className="info-title">
          <p>{t('anyDevice.title', { ns: 'home_info' })}</p>
        </div>
        <div className="info-text">
          <p>{t('anyDevice.text', { ns: 'home_info' })}</p>
        </div>
      </div>
    </section>
  )
}

export default HomeInfo;

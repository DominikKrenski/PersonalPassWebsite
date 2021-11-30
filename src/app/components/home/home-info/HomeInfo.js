import { useTranslation } from 'react-i18next';

import './HomeInfo.local.scss';

const HomeInfo = () => {
  const { t } = useTranslation();

  return (
    <section id="home-info" className="columns is-multiline">
      <div className="column is-two-fifhts">
        <div className="info-title">
          <p>{t('homeInfo.algorithm.title')}</p>
        </div>
        <div className="info-text">
          <p>{t('homeInfo.algorithm.text')}</p>
        </div>
      </div>

      <div className="column is-two-fifths is-offset-one-fifth">
        <div className="info-title">
          <p>{t('homeInfo.encryption.title')}</p>
        </div>
        <div className="info-text">
          <p>{t('homeInfo.encryption.text')}</p>
        </div>
      </div>

      <div className="column is-two-fifths">
        <div className="info-title">
          <p>{t('homeInfo.openSource.title')}</p>
        </div>
        <div className="info-text">
          <p>{t('homeInfo.openSource.text')}</p>
        </div>
      </div>

      <div className="column is-two-fifhts is-offset-one-fifth">
        <div className="info-title">
          <p>{t('homeInfo.anyDevice.title')}</p>
        </div>
        <div className="info-text">
          <p>{t('homeInfo.anyDevice.text')}</p>
        </div>
      </div>
    </section>
  )
}

export default HomeInfo;

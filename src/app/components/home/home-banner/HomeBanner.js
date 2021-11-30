import { useTranslation } from 'react-i18next';

import LockIcon from '../../../../assets/img/lock-64.png';
import './HomeBanner.local.scss';

const HomeBanner = () => {
  const { t } = useTranslation();

  return (
    <section id="home-banner" className="hero">
      <div className="hero-body">
        <p className="title">{t('homeBanner.title')}</p>
      </div>
      <figure id="lock-icon" className="image is-64x64">
        <img src={LockIcon} alt="lock icon"/>
      </figure>
    </section>
  )
}

export default HomeBanner;

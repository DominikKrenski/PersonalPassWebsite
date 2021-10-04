import HomeNavigation from './home-navigation/HomeNavigation';
import HomeBanner from './home-banner/HomeBanner';
import HomeInfo from './home-info/HomeInfo';
import AppFooter from '../shared/app-footer/AppFooter';

import './Home.local.scss';

const Home = () => {
  return (
    <div id="home">
      <HomeNavigation />
      <HomeBanner />
      <HomeInfo />
      <AppFooter />
    </div>
  )
}

export default Home;

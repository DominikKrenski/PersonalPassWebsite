import HomeNavigation from './home-navigation/HomeNavigation';
import HomeBanner from './home-banner/HomeBanner';
import HomeInfo from './home-info/HomeInfo';

import './Home.local.scss';

const Home = () => {
  return (
    <div id="home">
      <HomeNavigation />
      <HomeBanner />
      <HomeInfo />
    </div>
  )
}

export default Home;

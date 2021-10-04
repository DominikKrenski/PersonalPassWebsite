import HomeNavigation from './home-navigation/HomeNavigation';
import HomeBanner from './home-banner/HomeBanner';

import './Home.local.scss';

const Home = () => {
  return (
    <div id="home">
      <HomeNavigation />
      <HomeBanner />
    </div>
  )
}

export default Home;

import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './AppInfo.local.scss';

const AppInfo = props => {
  const { msg, closeCallback } = props;

  const handleCloseIconClick = () => {
    closeCallback(false);
  }

  return (
    <div id="app-info-wrapper" className="columns">
      <div className="column is-half is-offset-one-quarter">
        <div id="app-info">
          <div id="app-info-title">
            <div><h1>PersonalPass</h1></div>
            <div
              id="close-icon"
              onClick={handleCloseIconClick}
            >
              <FontAwesomeIcon icon="times-circle" size="lg" />
            </div>
          </div>

          <div id="app-info-content">
            {msg}
          </div>
        </div>
      </div>
    </div>
  )
}

AppInfo.propTypes = {
  msg: PropTypes.string.isRequired,
  closeCallback: PropTypes.func.isRequired
}

export default AppInfo;

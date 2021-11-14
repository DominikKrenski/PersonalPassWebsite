import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ServerError.local.scss';

const ServerError = () => {
  return (
    <div id="server-error-wrapper" className="column is-half is-offset-one-quarter">
      <div id="server-error" className="columns is-vcentered is-mobile">
        <div id="server-error-icon" className="column is-1">
          <FontAwesomeIcon icon="exclamation-circle" size="lg" />
        </div>
        <div id="server-error-body" className="column is-11">
          <p>There is other record</p>
        </div>
      </div>
    </div>
  )
}

export default ServerError;

import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './AppError.local.scss';

const AppError = props => {
  const {error} = props;

  return (
    <div id="server-error-wrapper" className="column is-half is-offset-one-quarter">
      <div id="server-error" className="columns is-vcentered is-mobile">
        <div id="server-error-icon" className="column is-1">
          <FontAwesomeIcon icon="exclamation-circle" size="lg" />
        </div>
        <div id="server-error-body" className="column is-11">
          <p>{error.message}</p>
        </div>
      </div>
    </div>
  )
}

AppError.propTypes = {
  error: PropTypes.exact({
    status: PropTypes.string,
    timestamp: PropTypes.string,
    message: PropTypes.string,
    errors: PropTypes.exact({
      field: PropTypes.string,
      rejectedValue: PropTypes.string,
      validationMessages: PropTypes.arrayOf(PropTypes.string)
    })
  })
}

export default AppError;

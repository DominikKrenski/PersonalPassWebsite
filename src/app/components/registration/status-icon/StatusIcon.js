import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './StatusIcon.local.scss';

const StatusIcon = props => {
  const { validated, error } = props;

  let icon;
  let color;

  if (!validated) {
    icon = <span className="initial"><FontAwesomeIcon icon="circle" size="sm"/></span>
  } else if (error) {
    icon = <span className="error"><FontAwesomeIcon icon="exclamation-circle" size="sm"/></span>
  } else {
    icon = <span className="success"><FontAwesomeIcon icon="check-circle" size="sm"/></span>
  }

  return (
    icon
  )
}

StatusIcon.propTypes = {
  validated: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default StatusIcon;

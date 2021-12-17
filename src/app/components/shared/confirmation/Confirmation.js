import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import './Confirmation.local.scss';

const Confirmation = props => {
  const {
    msg,
    cancelButtonText,
    confirmButtonText,
    cancelCallback,
    confirmCallback
  } = props;

  const { t } = useTranslation();

  return (
    <div id="confirmation-wrapper">
      <div id="confirmation" className="column is-half is-offset-one-quarter">
        <div id="confirmation-header">
          <h1>{t('header', { ns: 'confirmation' })}</h1>
        </div>
        <div id="confirmation-body">
          {msg}
        </div>
        <div id="confirmation-footer">
          <button className="button" onClick={cancelCallback}>{cancelButtonText}</button>
          <button className="button is-danger" onClick={confirmCallback}>{confirmButtonText}</button>
        </div>
      </div>
    </div>
  )
}

Confirmation.propTypes = {
  msg: PropTypes.string.isRequired,
  cancelButtonText: PropTypes.string.isRequired,
  confirmButtonText: PropTypes.string.isRequired,
  cancelCallback: PropTypes.func.isRequired,
  confirmCallback: PropTypes.func.isRequired
}

export default Confirmation;

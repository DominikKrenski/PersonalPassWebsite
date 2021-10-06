import PropTypes from 'prop-types';

import './ValidationMessage.local.scss';

const ValidationMessage = props => {
  const { field, errors } = props;
  const el = [];

  const capitalize = str => {
    const arr = str.split('');
    arr[0] = arr[0].toLocaleUpperCase();
    return arr.join('');
  }

  Object.keys(errors).forEach(key => {
    switch(key) {
      case 'required':
        el.push(<li key={key}>{capitalize(field)} is required</li>);
        break;
      case 'email':
        el.push(<li key={key}>{errors[key]}</li>);
        break;
      case 'minLength':
        el.push(<li key={key}>{capitalize(field)} must be at least {errors[key]} characters long</li>);
        break;
      case 'maxLength':
        el.push(<li key={key}>{capitalize(field)} must be at most {errors[key]} characters long</li>);
        break;
      case 'atLeastOneDigit':
        el.push(<li key={key}>{capitalize(field)} must contain at least one digit</li>);
        break;
      case 'atLeastOneLowercase':
        el.push(<li key={key}>{capitalize(field)} must contain at least one lowercase letter</li>);
        break;
      case 'atLeastOneUppercase':
        el.push(<li key={key}>{capitalize(field)} must contain at least one uppercase letter</li>);
        break;
      case 'notEmail':
        el.push(<li key={key}>{capitalize(field)} must not contain email</li>);
        break;
      case 'equalField':
        el.push(<li>{errors[key]}</li>);
        break
    }
  });

  return (
    <div className="validation-message">
      <ul>
        {el}
      </ul>
    </div>
  )
}

ValidationMessage.propTypes = {
  field: PropTypes.string.isRequired,
  errors: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired
}

export default ValidationMessage;

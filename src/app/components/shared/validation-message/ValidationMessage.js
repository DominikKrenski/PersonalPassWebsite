import PropTypes from 'prop-types';

import i18n from '../../../i18n';

import './ValidationMessage.local.scss';

const ValidationMessage = props => {
  const { errors } = props;
  const el = [];

  let currentLang;

  if (i18n.language === 'pl' || i18n.language === 'pl-PL') {
    currentLang = 'pl';
  } else {
    currentLang = 'en';
  }

  Object.keys(errors).forEach(key => {
    switch(key) {
      case 'required':
        el.push(<li key={key}>{currentLang === 'pl' ? 'Pole jest wymagane' : 'Field is required'}</li>);
        break;
      case 'email':
        el.push(<li key={key}>{currentLang === 'pl' ? 'Email nie jest poprawny' : 'Email is not valid'}</li>)
        break;
      case 'minLength':
        el.push(<li key={key}>
          {currentLang === 'pl' ? `Pole musi zawierać co najmniej ${errors[key]} znaków` : `Field must be at least ${errors[key]} characters long`};
        </li>
        )
        break;
      case 'maxLength':
        el.push(<li key={key}>
          {currentLang === 'pl' ? `Pole musi zawierać najwyżej ${errors[key]} znaków` : `Field must be at most ${errors[key]} characters long`};
        </li>
        )
        break;
      case 'atLeastOneDigit':
        el.push(<li key={key}>
          {currentLang === 'pl' ? `Pole musi zawierać przynajmniej jedną cyfrę` : `Field must contain at least one digit`};
        </li>
        )
        break;
      case 'atLeastOneLowercase':
        el.push(<li key={key}>
          {currentLang === 'pl' ? `Pole musi zawierać przynajmniej jedną małą literę` : `Field must contain at least one lowercase letter`};
        </li>
        )
        break;
      case 'atLeastOneUppercase':
        el.push(<li key={key}>
          {currentLang === 'pl' ? `Pole musi zawierać przynajmniej jedną wielką literę` : `Field must contain at least one uppercase letter`}
        </li>
        )
        break;
      case 'notEmail':
        el.push(<li key={key}>
          {currentLang === 'pl' ? `Pole nie może zawierać adresu email` : `Field must not contain email`}
        </li>
        )
        break;
      case 'equalField':
        el.push(<li key={key}>{currentLang === 'pl' ? 'Pola nie są jednakowe' : 'Fields are not equal'}</li>)
        break;
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './RegistrationForm.local.scss';

const RegistrationForm = () => {
  return (
    <div id="registration-form-wrapper" className="column is-half is-offset-one-quarter">
      <form noValidate={true}>

        {/* EMAIL FIELD */}
        <div className="field">
          <label className="label" htmlFor="email">Email</label>
          <div className="control has-icons-left">
            <input className="input" type="email" name="email"/>
            <span className="icon is-left">
              <FontAwesomeIcon icon="envelope" size="lg" />
            </span>
          </div>
        </div>

        {/* PASSWORD FIELD */}
        <div className="field">
          <label className="label" htmlFor="password">Password</label>
          <div className="control has-icons-left has-icons-right">
            <input className="input" type="password" name="password"/>
            <span className="icon is-left">
              <FontAwesomeIcon icon="lock" size="lg"/>
            </span>
            <span className="icon is-right">
              <FontAwesomeIcon icon="eye" size="lg"/>
            </span>
          </div>
        </div>

        {/* PASSWORD REQUIREMENTS FIELD */}

        {/* PASSWORD CONFIRM FIELD */}
        <div className="field">
          <label className="label" htmlFor="passwordConfirm">Confirm your password</label>
          <div className="control has-icons-left">
            <input className="input" type="password" name="passwordConfirm"/>
            <span className="icon is-left">
              <FontAwesomeIcon icon="lock" size="lg"/>
            </span>
          </div>
        </div>

        {/* REMINDER FIELD */}
        <div className="field">
          <label className="label" htmlFor="reminder">Reminder (optional)</label>
          <div className="control has-icons-left">
            <input className="input" type="text" name="reminder"/>
            <span className="icon is-left">
              <FontAwesomeIcon icon="sticky-note" size="lg"/>
            </span>
          </div>
        </div>

        {/* REGISTRATION BUTTON */}
        <div id="registration-button" className="field">
          <div className="control">
            <button className="button is-fullwidth">Register</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegistrationForm;

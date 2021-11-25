import './Account.local.scss';

const Account = () => {
  return (
    <div id="account-details" className="column is-10">
      <h1>Account Settings</h1>

      <table>
        <thead>
          <tr>
            <th colSpan="2">Login Credentials</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Account Email</td>
            <td>bla bla bla safaskdfaklfjakljfaklfjalkjfklfjlakjfklajflakfjalkjalkfjalkfjalsdkfjaljflajfalkfjl</td>
          </tr>
          <tr>
            <td>Master Password</td>
            <td>bla bla bla</td>
          </tr>
          <tr>
            <td>Master Password Reminder</td>
            <td>bla bla bla</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Account;

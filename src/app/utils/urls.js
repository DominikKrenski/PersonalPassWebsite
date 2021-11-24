/**
 * Urls module
 * @module urls
 */

/**
 * Exposed server endpoints
 */
const urls = {
  signup: '/auth/signup',
  signin: '/auth/signin',
  signout: '/auth/signout',
  salt: '/auth/salt',
  accountDetails: '/accounts',
  updateEmail: '/accounts/email',
  updateReminder: '/accounts/reminder',
  sendHint: '/accounts/hint'
}

export default urls;

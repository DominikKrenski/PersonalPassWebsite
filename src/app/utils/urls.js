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
  refresh: '/auth/refresh',
  salt: '/auth/salt',
  accountDetails: '/accounts/',
  updateEmail: '/accounts/email',
  testEmail: '/accounts/test-email',
  sendHint: '/accounts/hint',
  accountSalt: '/accounts/salt',
  data: '/data'
}

export default urls;

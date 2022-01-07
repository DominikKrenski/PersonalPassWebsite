import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    ns: [
      'home_banner',
      'home_info',
      'home_navigation',
      'login_form',
      'registration_form',
      'app_counter',
      'confirmation',
      'logout_button',
      'secure_nav',
      'password_hint',
      'account',
      'email_update',
      'password_update',
      'address',
      'address_form',
      'data_table',
      'data_row',
      'site',
      'site_form',
      'password',
      'password_form',
      'note',
      'note_form',
      'items',
      'pass_update_form'
    ],
    detection: {
      // order and from where user language should be detected
      order: ['querystring', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

      // keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // cache user language on
      caches: ['sessionStorage', 'localStorage'],

      // optional htmlTag with lang attribute
      htmlTag: document.documentElement,
    },
    backend: {
      loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
      allowMultiLoading: false,
      crossDomain: false,
      withCredentials: false,
      overrideMimeType: false,
    }
  });

  export default i18n;

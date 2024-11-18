import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import enTranslation from './translations/en.json';
import frTranslation from './translations/fr.json';
import deTranslation from './translations/de.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: {
      translation: enTranslation,
    },
    fr: {
      translation: frTranslation,
    },
    de: {
      translation: deTranslation,
    },
  },
  fallbackLng: 'fr',
  detection: {
    order: [''],
    caches: [],
  },
  lng: 'fr', // Use device locale
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

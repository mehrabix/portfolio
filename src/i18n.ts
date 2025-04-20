import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files directly
import enTranslation from './translations/en.json';
import deTranslation from './translations/de.json';
import svTranslation from './translations/sv.json';
import fiTranslation from './translations/fi.json';
import trTranslation from './translations/tr.json';
import frTranslation from './translations/fr.json';
import esTranslation from './translations/es.json';
import arTranslation from './translations/ar.json';
import ruTranslation from './translations/ru.json';
import zhTranslation from './translations/zh.json';
// Import new translation files
import itTranslation from './translations/it.json';
import roTranslation from './translations/ro.json';
import plTranslation from './translations/pl.json';
import huTranslation from './translations/hu.json';
import elTranslation from './translations/el.json';
import mtTranslation from './translations/mt.json';
import daTranslation from './translations/da.json';
import etTranslation from './translations/et.json';

// Initialize i18next
i18n
  // Load translation using http backend
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize configuration
  .init({
    // Resources contain translations
    resources: {
      en: {
        translation: enTranslation
      },
      de: {
        translation: deTranslation
      },
      sv: {
        translation: svTranslation
      },
      fi: {
        translation: fiTranslation
      },
      tr: {
        translation: trTranslation
      },
      fr: {
        translation: frTranslation
      },
      es: {
        translation: esTranslation
      },
      ar: {
        translation: arTranslation
      },
      ru: {
        translation: ruTranslation
      },
      zh: {
        translation: zhTranslation
      },
      // Add new language resources
      it: {
        translation: itTranslation
      },
      ro: {
        translation: roTranslation
      },
      pl: {
        translation: plTranslation
      },
      hu: {
        translation: huTranslation
      },
      el: {
        translation: elTranslation
      },
      mt: {
        translation: mtTranslation
      },
      da: {
        translation: daTranslation
      },
      et: {
        translation: etTranslation
      }
    },
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Detection options
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
    
    // Preload languages to prevent flickering
    preload: ['en', 'de', 'sv', 'fi', 'tr', 'fr', 'es', 'ar', 'ru', 'zh', 
             'it', 'ro', 'pl', 'hu', 'el', 'mt', 'da', 'et'],
    
    // SSR support
    initImmediate: typeof window !== 'undefined',
  });

export default i18n; 
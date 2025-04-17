import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files directly
import enTranslation from './translations/en.json';
import deTranslation from './translations/de.json';

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
      }
    },
    fallbackLng: 'de',
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
    preload: ['en', 'de'],
    
    // SSR support
    initImmediate: typeof window !== 'undefined',
  });

export default i18n; 
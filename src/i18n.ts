import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files directly
import enTranslation from './translations/en.json';
import deTranslation from './translations/de.json';

// Get initial language from localStorage if available, or default to 'en'
const getInitialLanguage = () => {
  // If we're in a browser environment, try to get from localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedLang = localStorage.getItem('language');
    if (storedLang === 'en' || storedLang === 'de') {
      return storedLang;
    }
  }
  // Default language for SSR and fallback
  return 'en';
};

// Initialize i18next with proper module handling
const i18nInstance = i18n.createInstance();

// Only add browser-specific modules when in browser environment
if (typeof window !== 'undefined') {
  i18nInstance
    .use(Backend)
    .use(LanguageDetector);
}

// Always use the React integration
i18nInstance.use(initReactI18next);

// Initialize configuration
i18nInstance.init({
  // Resources contain translations
  resources: {
    en: {
      translation: enTranslation
    },
    de: {
      translation: deTranslation
    }
  },
  lng: getInitialLanguage(), // Use same initial language for SSR and client
  fallbackLng: 'en',
  debug: false,
  
  interpolation: {
    escapeValue: false, // React already escapes values
  },

  // Detection options - only used in browser
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

export default i18nInstance; 
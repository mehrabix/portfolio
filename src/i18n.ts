import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Only import fallback language (English) upfront
import enTranslation from './translations/en.json';

// Language mapping for dynamic imports
const languageMap: Record<string, () => Promise<any>> = {
  en: () => Promise.resolve({ default: enTranslation }),
  de: () => import('./translations/de.json'),
  sv: () => import('./translations/sv.json'),
  fi: () => import('./translations/fi.json'),
  tr: () => import('./translations/tr.json'),
  fr: () => import('./translations/fr.json'),
  es: () => import('./translations/es.json'),
  ar: () => import('./translations/ar.json'),
  ru: () => import('./translations/ru.json'),
  zh: () => import('./translations/zh.json'),
  it: () => import('./translations/it.json'),
  ro: () => import('./translations/ro.json'),
  pl: () => import('./translations/pl.json'),
  hu: () => import('./translations/hu.json'),
  el: () => import('./translations/el.json'),
  mt: () => import('./translations/mt.json'),
  da: () => import('./translations/da.json'),
  et: () => import('./translations/et.json'),
  pt: () => import('./translations/pt.json'),
};

// Function to dynamically load a language
export const loadLanguage = async (lng: string): Promise<void> => {
  if (!i18n.hasResourceBundle(lng, 'translation')) {
    try {
      const loader = languageMap[lng];
      if (loader) {
        const translation = await loader();
        i18n.addResourceBundle(lng, 'translation', translation.default || translation);
      }
    } catch (error) {
      console.error(`Failed to load language ${lng}:`, error);
    }
  }
};

// Initialize i18next with only English loaded
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize configuration
  .init({
    // Only load English initially
    resources: {
      en: {
        translation: enTranslation
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
    
    // SSR support
    initImmediate: typeof window !== 'undefined',
  });

// Load the detected language after initialization
i18n.on('languageChanged', (lng) => {
  loadLanguage(lng).catch(console.error);
});

// Load initial language if not English
const initialLanguage = i18n.language || 'en';
if (initialLanguage !== 'en') {
  loadLanguage(initialLanguage).catch(console.error);
}

export default i18n; 
import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  
  // Get the initial language for SSR - same logic as in i18n.ts
  const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedLang = localStorage.getItem('language');
      if (storedLang === 'en' || storedLang === 'de') {
        return storedLang as Language;
      }
    }
    return 'en';
  };
  
  // Use a state to track the language to ensure it's reactive
  const [language, setLanguageState] = useState<Language>(getInitialLanguage());
  
  // Mark component as mounted after initial render
  useEffect(() => {
    setIsMounted(true);
    
    // Sync with i18n's current language
    const currentLang = (i18n.language?.startsWith('en') ? 'en' : 'de') as Language;
    if (currentLang !== language) {
      setLanguageState(currentLang);
    }
  }, [i18n.language, language]);
  
  // Change language function that works with i18next
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    i18n.changeLanguage(newLanguage).catch(error => {
      console.error('Failed to change language:', error);
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context - this maintains compatibility with existing code
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 
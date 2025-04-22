import React, { createContext, ReactNode, useContext } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'de' | 'sv' | 'fi' | 'tr' | 'fr' | 'es' | 'ar' | 'ru' | 'zh' | 
               'it' | 'ro' | 'pl' | 'hu' | 'el' | 'mt' | 'da' | 'et' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean; // Add RTL status indicator
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  
  // Get current language - handle multiple language formats
  const getLanguage = (): Language => {
    const lang = i18n.language?.split('-')[0] || 'en';
    return ['en', 'de', 'sv', 'fi', 'tr', 'fr', 'es', 'ar', 'ru', 'zh', 
           'it', 'ro', 'pl', 'hu', 'el', 'mt', 'da', 'et', 'pt'].includes(lang) 
      ? lang as Language 
      : 'en';
  };
  
  const language = getLanguage();
  
  // Determine if the current language is RTL
  // Greek (el) uses LTR despite having some RTL characters
  const isRTL = language === 'ar';
  
  // Change language function that works with i18next
  const setLanguage = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage).catch(error => {
      console.error('Failed to change language:', error);
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
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
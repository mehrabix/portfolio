import React, { createContext, ReactNode, useContext } from 'react';
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
  
  // Get current language - handle both i18next format and our simplified format
  const language = (i18n.language?.startsWith('en') ? 'en' : 'de') as Language;
  
  // Change language function that works with i18next
  const setLanguage = (newLanguage: Language) => {
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
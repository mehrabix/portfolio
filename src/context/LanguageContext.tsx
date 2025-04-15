import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Default to German if no language is set
const getInitialLanguage = (): Language => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'de'].includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // Try to detect browser language
    const browserLanguage = navigator.language.split('-')[0];
    if (browserLanguage === 'en') return 'en';
  }
  
  return 'de';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Load translations when language changes
  React.useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`../translations/${language}.json`);
        setTranslations(translationModule.default);
        
        // Save language preference
        if (typeof window !== 'undefined') {
          localStorage.setItem('language', language);
        }
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };
    
    loadTranslations();
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 
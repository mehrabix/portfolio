import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

// SVG flags as components
const UKFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 60 30" className="rounded-sm">
    <clipPath id="a">
      <path d="M0 0v30h60V0z"/>
    </clipPath>
    <clipPath id="b">
      <path d="M30 15h30v15zv15H0zH0V0zV0h30z"/>
    </clipPath>
    <g clipPath="url(#a)">
      <path d="M0 0v30h60V0z" fill="#012169"/>
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/>
      <path d="M0 0l60 30m0-30L0 30" clipPath="url(#b)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const GermanFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 5 3" className="rounded-sm">
    <rect width="5" height="3" y="0" x="0" fill="#000"/>
    <rect width="5" height="2" y="1" x="0" fill="#D00"/>
    <rect width="5" height="1" y="2" x="0" fill="#FFCE00"/>
  </svg>
);

const LanguageSelector: React.FC = () => {
  // Use language context
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: <UKFlag /> },
    { code: 'de', name: 'Deutsch', flag: <GermanFlag /> },
  ];

  // Get current language
  const getCurrentLanguage = () => {
    const current = languages.find(lang => lang.code === language);
    return current || languages[0];
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    setIsMounted(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Only render the actual content when mounted to prevent hydration issues
  const currentLanguage = getCurrentLanguage();

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMounted ? t('nav.language') : ''}
      >
        <div className="flex items-center justify-center">{currentLanguage.flag}</div>
        {isMounted && (
          <span className="font-medium hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && isMounted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 bg-black/90 backdrop-blur-xl border border-blue-900/30 rounded-lg shadow-lg w-40 z-[9999]"
            style={{
              boxShadow: '0 0 20px rgba(30, 64, 175, 0.3)'
            }}
          >
            <div className="py-2">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as 'en' | 'de');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm ${
                    language === lang.code 
                      ? 'text-white bg-blue-900/30' 
                      : 'text-gray-300 hover:text-white hover:bg-blue-900/20'
                  } transition-colors flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg`}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center justify-center">{lang.flag}</div>
                  <span>{lang.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector; 
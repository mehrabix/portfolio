import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t('nav.language')}
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="font-medium hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
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
                  <span className="text-xl">{lang.flag}</span>
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
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { loadLanguage } from '../i18n';

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

const SwedishFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 16 10" className="rounded-sm">
    <rect width="16" height="10" fill="#006AA7"/>
    <rect width="2" height="10" x="5" fill="#FECC00"/>
    <rect width="16" height="2" y="4" fill="#FECC00"/>
  </svg>
);

const FinnishFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 16 10" className="rounded-sm">
    <rect width="16" height="10" fill="#fff"/>
    <rect width="16" height="2" y="4" fill="#003580"/>
    <rect width="2" height="10" x="5" fill="#003580"/>
  </svg>
);

const TurkishFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 30 20" className="rounded-sm">
    <rect width="30" height="20" fill="#E30A17"/>
    <circle cx="10" cy="10" r="5" fill="#ffffff"/>
    <circle cx="11.2" cy="10" r="4" fill="#E30A17"/>
    <polygon fill="#ffffff" points="16,10 17.5,13.5 14.5,11.5 17.5,9.5 15,6"/>
  </svg>
);

const FrenchFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 3 2" className="rounded-sm">
    <rect width="1" height="2" x="0" y="0" fill="#002395"/>
    <rect width="1" height="2" x="1" y="0" fill="#FFFFFF"/>
    <rect width="1" height="2" x="2" y="0" fill="#ED2939"/>
  </svg>
);

const SpanishFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 750 500" className="rounded-sm">
    <rect width="750" height="500" fill="#c60b1e"/>
    <rect width="750" height="250" fill="#ffc400"/>
  </svg>
);

const ArabicFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 12 6" className="rounded-sm">
    <rect width="12" height="2" y="0" fill="#007A3D"/>
    <rect width="12" height="2" y="2" fill="#FFFFFF"/>
    <rect width="12" height="2" y="4" fill="#000000"/>
    <polygon fill="#CE1126" points="0,0 4,3 0,6"/>
  </svg>
);

const RussianFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 9 6" className="rounded-sm">
    <rect width="9" height="2" y="0" fill="#fff"/>
    <rect width="9" height="2" y="2" fill="#0039A6"/>
    <rect width="9" height="2" y="4" fill="#D52B1E"/>
  </svg>
);

const ChineseFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 30 20" className="rounded-sm">
    <rect width="30" height="20" fill="#DE2910"/>
    <g fill="#FFDE00">
      <polygon points="5,2 6,4.5 8.5,5 6,5.5 5,8 4,5.5 1.5,5 4,4.5"/>
      <polygon points="10,2 10.5,3 11.5,3 10.5,4 11,5 10,4.5 9,5 9.5,4 8.5,3 9.5,3"/>
      <polygon points="12,5 12.5,6 13.5,6 12.5,7 13,8 12,7.5 11,8 11.5,7 10.5,6 11.5,6"/>
      <polygon points="10,9 10.5,10 11.5,10 10.5,11 11,12 10,11.5 9,12 9.5,11 8.5,10 9.5,10"/>
      <polygon points="7,7 7.5,8 8.5,8 7.5,9 8,10 7,9.5 6,10 6.5,9 5.5,8 6.5,8"/>
    </g>
  </svg>
);

// New flag components
const ItalianFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 3 2" className="rounded-sm">
    <rect width="1" height="2" x="0" y="0" fill="#009246"/>
    <rect width="1" height="2" x="1" y="0" fill="#FFFFFF"/>
    <rect width="1" height="2" x="2" y="0" fill="#CE2B37"/>
  </svg>
);

const RomanianFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 3 2" className="rounded-sm">
    <rect width="1" height="2" x="0" y="0" fill="#002B7F"/>
    <rect width="1" height="2" x="1" y="0" fill="#FCD116"/>
    <rect width="1" height="2" x="2" y="0" fill="#CE1126"/>
  </svg>
);

const PolishFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 16 10" className="rounded-sm">
    <rect width="16" height="5" fill="#fff"/>
    <rect width="16" height="5" y="5" fill="#dc143c"/>
  </svg>
);

const HungarianFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 6 3" className="rounded-sm">
    <rect width="6" height="1" y="0" fill="#ce1126"/>
    <rect width="6" height="1" y="1" fill="#fff"/>
    <rect width="6" height="1" y="2" fill="#008751"/>
  </svg>
);

const GreekFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 27 18" className="rounded-sm">
    <rect width="27" height="18" fill="#0D5EAF"/>
    <rect width="27" height="2" y="2" fill="#FFFFFF"/>
    <rect width="27" height="2" y="6" fill="#FFFFFF"/>
    <rect width="27" height="2" y="10" fill="#FFFFFF"/>
    <rect width="27" height="2" y="14" fill="#FFFFFF"/>
    <rect width="10" height="10" fill="#FFFFFF"/>
    <rect width="2" height="10" x="4" fill="#0D5EAF"/>
    <rect width="10" height="2" y="4" fill="#0D5EAF"/>
  </svg>
);

const MalteseFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 3 2" className="rounded-sm">
    <rect width="3" height="2" fill="#FFFFFF"/>
    <rect width="1.5" height="2" fill="#CF142B"/>
  </svg>
);

const DanishFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 37 28" className="rounded-sm">
    <rect width="37" height="28" fill="#C8102E"/>
    <rect width="4" height="28" x="12" fill="#FFFFFF"/>
    <rect width="37" height="4" y="12" fill="#FFFFFF"/>
  </svg>
);

const EstonianFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 33 21" className="rounded-sm">
    <rect width="33" height="7" y="0" fill="#0072CE"/>
    <rect width="33" height="7" y="7" fill="#000000"/>
    <rect width="33" height="7" y="14" fill="#FFFFFF"/>
  </svg>
);

const PortugueseFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 15 10" className="rounded-sm">
    <rect width="15" height="10" fill="#006600"/>
    <rect width="10" height="10" fill="#FF0000"/>
    <circle cx="5" cy="5" r="2.5" fill="#FFCC00"/>
    <circle cx="5" cy="5" r="2" fill="#FFFFFF"/>
    <path d="M 3.25,5 A 1.75,1.75 0 0 1 5,3.25 A 1.75,1.75 0 0 1 6.75,5 A 1.75,1.75 0 0 1 5,6.75 A 1.75,1.75 0 0 1 3.25,5 z" fill="#002868"/>
  </svg>
);

const LanguageSelector: React.FC = () => {
  // Use i18next directly alongside the context for compatibility
  const { i18n, t } = useTranslation();
  const { language, setLanguage, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: <UKFlag /> },
    { code: 'de', name: 'Deutsch', flag: <GermanFlag /> },
    { code: 'sv', name: 'Svenska', flag: <SwedishFlag /> },
    { code: 'fi', name: 'Suomi', flag: <FinnishFlag /> },
    { code: 'tr', name: 'Türkçe', flag: <TurkishFlag /> },
    { code: 'fr', name: 'Français', flag: <FrenchFlag /> },
    { code: 'es', name: 'Español', flag: <SpanishFlag /> },
    { code: 'it', name: 'Italiano', flag: <ItalianFlag /> },
    { code: 'ro', name: 'Română', flag: <RomanianFlag /> },
    { code: 'pl', name: 'Polski', flag: <PolishFlag /> },
    { code: 'hu', name: 'Magyar', flag: <HungarianFlag /> },
    { code: 'el', name: 'Ελληνικά', flag: <GreekFlag /> },
    { code: 'mt', name: 'Malti', flag: <MalteseFlag /> },
    { code: 'da', name: 'Dansk', flag: <DanishFlag /> },
    { code: 'et', name: 'Eesti', flag: <EstonianFlag /> },
    { code: 'pt', name: 'Português', flag: <PortugueseFlag /> },
    { code: 'ar', name: 'العربية', flag: <ArabicFlag /> },
    { code: 'ru', name: 'Русский', flag: <RussianFlag /> },
    { code: 'zh', name: '中文', flag: <ChineseFlag /> }
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
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t('nav.language')}
      >
        <div className="flex items-center justify-center">{currentLanguage.flag}</div>
        <span className="font-medium hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 bg-black/90 backdrop-blur-xl border border-blue-900/30 rounded-lg shadow-lg w-40 z-[9999] max-h-80 overflow-y-auto custom-scrollbar"
            style={{
              boxShadow: '0 0 20px rgba(30, 64, 175, 0.3)'
            }}
          >
            <div className="py-2">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={async () => {
                    // Load language dynamically before switching
                    await loadLanguage(lang.code);
                    setLanguage(lang.code as any);
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
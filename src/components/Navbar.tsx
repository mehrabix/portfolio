import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../context/LanguageContext'
import LanguageSelector from './LanguageSelector'

const Navbar = () => {
  // Use the language context
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Create nav items only after component is mounted to prevent hydration mismatches
  const getNavItems = () => {
    if (!isMounted) {
      // Return empty placeholders during SSR
      return [
        { name: '', href: '#about' },
        { name: '', href: '#experience' },
        { name: '', href: '#skills' },
        { name: '', href: '#projects' },
        { name: '', href: '#contact' },
      ];
    }
    
    // Only populate with translations after mounting
    return [
      { name: t('nav.about'), href: '#about' },
      { name: t('nav.experience'), href: '#experience' },
      { name: t('nav.skills'), href: '#skills' },
      { name: t('nav.projects'), href: '#projects' },
      { name: t('nav.contact'), href: '#contact' },
    ];
  };
  
  const navItems = getNavItems();

  // Optimized hover animations based on device
  const hoverAnimation = isMobile 
    ? { scale: 1.05 } 
    : { scale: 1.05, rotateY: 10 };

  const tapAnimation = { scale: 0.95 };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-[9999] transition-all duration-300 ${
        scrolled 
          ? 'bg-black/75 backdrop-blur-2xl border-b border-blue-900/20 shadow-[0_4px_30px_rgba(0,0,0,0.4)]' 
          : 'bg-black/30 backdrop-blur-lg'
      }`}
      style={{
        perspective: isMobile ? 'none' : '1000px',
        transform: 'translateZ(0)', // Force GPU acceleration
        boxShadow: scrolled ? '0 4px 20px rgba(30, 64, 175, 0.15)' : 'none'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="#"
            className="text-2xl font-bold text-white ml-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            whileHover={hoverAnimation}
            whileTap={tapAnimation}
            style={{
              transformStyle: isMobile ? 'flat' : 'preserve-3d',
              transform: 'translateZ(0)', // Force GPU acceleration
              textShadow: '0 0 15px rgba(59,130,246,0.3)'
            }}
          >
            AM
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-8 mr-4">
              {/* Only show nav items when mounted */}
              {isMounted && navItems.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors relative group"
                  whileHover={isMobile ? { y: -2 } : { y: -2, rotateX: 10 }}
                  whileTap={tapAnimation}
                  style={{
                    transformStyle: isMobile ? 'flat' : 'preserve-3d',
                    transform: 'translateZ(0)', // Force GPU acceleration
                  }}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300" 
                        style={{ boxShadow: '0 0 10px rgba(59,130,246,0.5)' }}></span>
                </motion.a>
              ))}
            </div>
            
            {/* Language Selector - Desktop */}
            <div className="border-l border-blue-900/30 pl-4">
              <LanguageSelector />
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            {/* Language Selector for Mobile */}
            <LanguageSelector />
            
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white transition-colors p-2"
              whileHover={hoverAnimation}
              whileTap={tapAnimation}
              style={{
                transformStyle: 'flat',
                transform: 'translateZ(0)', // Force GPU acceleration
              }}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && isMounted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9998] lg:hidden"
              style={{
                transform: 'translateZ(0)', // Force GPU acceleration
              }}
            >
              {/* Backdrop with enhanced blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-gradient-to-b from-black/80 to-black/70 backdrop-blur-2xl z-[9997]"
                onClick={() => setIsOpen(false)}
                style={{
                  transform: 'translateZ(0)', // Force GPU acceleration
                }}
              />
              
              {/* Menu panel with 3D effect */}
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] z-[9999]"
                style={{
                  transformStyle: isMobile ? 'flat' : 'preserve-3d',
                  transform: 'translateZ(0)', // Force GPU acceleration
                  boxShadow: '0 4px 20px rgba(30, 64, 175, 0.15)'
                }}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-blue-900/30 px-4 py-4">
                    <motion.h2 
                      className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                      whileHover={hoverAnimation}
                      style={{
                        transformStyle: isMobile ? 'flat' : 'preserve-3d',
                        transform: 'translateZ(0)', // Force GPU acceleration
                        textShadow: '0 0 15px rgba(59,130,246,0.3)'
                      }}
                    >
                      {t('nav.menu')}
                    </motion.h2>
                    <div className="w-12 flex justify-end">
                      <motion.button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-300 hover:text-white hover:bg-blue-900/10 rounded transition-colors"
                        whileHover={hoverAnimation}
                        whileTap={tapAnimation}
                        style={{
                          transformStyle: 'flat',
                          transform: 'translateZ(0)', // Force GPU acceleration
                        }}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <nav className="space-y-1 px-4 py-6">
                    {navItems.map((item) => (
                      <motion.a
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-900/10 transition-colors"
                        whileHover={isMobile ? { x: 10 } : { x: 10, rotateY: 5 }}
                        style={{
                          transformStyle: isMobile ? 'flat' : 'preserve-3d',
                          transform: 'translateZ(0)', // Force GPU acceleration
                        }}
                      >
                        {item.name}
                      </motion.a>
                    ))}
                  </nav>
                  
                  <div className="border-t border-blue-900/30 p-4">
                    <motion.a
                      href="#contact"
                      onClick={() => setIsOpen(false)}
                      className="block w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-center text-white hover:from-blue-700 hover:to-purple-700 transition-colors"
                      whileHover={hoverAnimation}
                      whileTap={tapAnimation}
                      style={{
                        transformStyle: isMobile ? 'flat' : 'preserve-3d',
                        transform: 'translateZ(0)', // Force GPU acceleration
                        boxShadow: '0 0 15px rgba(30, 64, 175, 0.3)'
                      }}
                    >
                      {isMounted ? t('nav.contactMe') : ''}
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar 
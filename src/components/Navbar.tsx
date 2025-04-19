import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../context/LanguageContext'
import LanguageSelector from './LanguageSelector'

interface NavbarProps {
  currentSection?: string;
}

const Navbar = ({ currentSection = 'hero' }: NavbarProps) => {
  // Use i18next directly
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', checkMobile)
    window.addEventListener('mousemove', handleMouseMove)
    checkMobile() // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  const navItems = [
    { name: t('nav.about'), href: '#about', id: 'about' },
    { name: t('nav.experience'), href: '#experience', id: 'experience' },
    { name: t('nav.skills'), href: '#skills', id: 'skills' },
    { name: t('nav.projects'), href: '#projects', id: 'projects' },
    { name: t('nav.contact'), href: '#contact', id: 'contact' },
  ]

  // Optimized hover animations based on device
  const hoverAnimation = isMobile 
    ? { scale: 1.05 } 
    : { scale: 1.05, rotateY: 10 }

  const tapAnimation = { scale: 0.95 }

  // Improved section navigation handler
  const handleNavigation = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    
    // Close mobile menu if open
    if (isOpen) {
      setIsOpen(false);
    }
    
    // Handle home navigation
    if (targetId === '') {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      window.history.pushState(null, '', window.location.pathname);
      return;
    }
    
    // Get the target element
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Calculate the exact position to scroll to with navbar offset
      const navbarHeight = 64; // Approximate height of navbar in pixels
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;
      
      // Use smooth scrolling
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without page reload
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-[9999] transition-all duration-300 ${
        scrolled 
          ? 'bg-black/60 backdrop-blur-2xl border-b border-blue-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.4)]' 
          : 'bg-black/20 backdrop-blur-md'
      }`}
      style={{
        perspective: isMobile ? 'none' : '1000px',
        transform: 'translateZ(0)', // Force GPU acceleration
        boxShadow: scrolled 
          ? '0 8px 32px rgba(2, 6, 23, 0.3), 0 0 10px rgba(59, 130, 246, 0.15)' 
          : 'none',
        position: 'fixed'
      }}
    >
      <div className="container mx-auto px-4" style={{ position: 'relative' }}>
        <div className="flex items-center justify-between h-16">
          {/* Logo with glow effect */}
          <motion.a
            href="#"
            onClick={(e) => handleNavigation(e, '')}
            className="relative px-3 py-2 font-bold text-white ml-2 overflow-hidden group rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={tapAnimation}
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 opacity-30 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-lg"></span>
            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 text-2xl" style={{ textShadow: '0 0 15px rgba(59,130,246,0.5)' }}>
              AM
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-8 mr-4">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavigation(e, item.id)}
                  className={`text-gray-300 hover:text-white transition-colors relative group px-2 py-1 ${
                    currentSection === item.id ? 'text-white' : ''
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={tapAnimation}
                >
                  {item.name}
                  <motion.span 
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 rounded-full`}
                    animate={{ width: currentSection === item.id ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      boxShadow: currentSection === item.id ? '0 0 10px rgba(59,130,246,0.5)' : 'none' 
                    }}
                  />
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
              className="text-gray-300 hover:text-white transition-colors p-2 ml-2 bg-blue-500/10 rounded-lg hover:bg-blue-500/20"
              whileHover={hoverAnimation}
              whileTap={tapAnimation}
              style={{
                backdropFilter: 'blur(8px)',
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
          {isOpen && (
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
                className="fixed inset-0 bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-xl z-[9997]"
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
                className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-3xl shadow-[0_8px_32px_rgba(2,6,23,0.3)] z-[9999]"
                style={{
                  transform: 'translateZ(0)', // Force GPU acceleration
                  boxShadow: '0 4px 20px rgba(30, 64, 175, 0.15)'
                }}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-blue-900/40 px-4 py-4">
                    <motion.h2 
                      className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                      whileHover={hoverAnimation}
                      style={{ textShadow: '0 0 15px rgba(59,130,246,0.3)' }}
                    >
                      {t('nav.menu')}
                    </motion.h2>
                    <div className="w-12 flex justify-end">
                      <motion.button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-300 hover:text-white hover:bg-blue-900/10 rounded-full transition-colors"
                        whileHover={hoverAnimation}
                        whileTap={tapAnimation}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <nav className="space-y-1 px-4 py-6">
                    {/* Mobile menu items */}
                    {navItems.map((item) => (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        onClick={(e) => handleNavigation(e, item.id)}
                        className={`block py-3 px-4 text-gray-300 hover:text-white hover:bg-blue-900/10 rounded-lg transition-all duration-200 relative ${
                          currentSection === item.id ? 'text-white bg-blue-900/20' : ''
                        }`}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                          {currentSection === item.id && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-2 w-2 rounded-full bg-blue-500"
                              style={{ boxShadow: '0 0 10px rgba(59,130,246,0.7)' }}
                            />
                          )}
                        </div>
                        {currentSection === item.id && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r"
                            initial={{ height: 0 }}
                            animate={{ height: '100%' }}
                            transition={{ duration: 0.3 }}
                            style={{ boxShadow: '0 0 10px rgba(59,130,246,0.5)' }}
                          />
                        )}
                      </motion.a>
                    ))}
                  </nav>
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
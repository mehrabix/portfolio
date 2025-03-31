import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', checkMobile)
    checkMobile() // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ]

  // Optimized hover animations based on device
  const hoverAnimation = isMobile 
    ? { scale: 1.05 } 
    : { scale: 1.05, rotateY: 10 }

  const tapAnimation = { scale: 0.95 }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-[9999] transition-all duration-300 ${
        scrolled 
          ? 'bg-primary/95 backdrop-blur-xl shadow-lg' 
          : 'bg-primary/90 backdrop-blur-lg'
      }`}
      style={{
        perspective: isMobile ? 'none' : '1000px',
        transform: 'translateZ(0)', // Force GPU acceleration
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="#"
            className="text-2xl font-bold text-secondary ml-4"
            whileHover={hoverAnimation}
            whileTap={tapAnimation}
            style={{
              transformStyle: isMobile ? 'flat' : 'preserve-3d',
              transform: 'translateZ(0)', // Force GPU acceleration
            }}
          >
            AM
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-textSecondary hover:text-secondary transition-colors"
                whileHover={isMobile ? { y: -2 } : { y: -2, rotateX: 10 }}
                whileTap={tapAnimation}
                style={{
                  transformStyle: isMobile ? 'flat' : 'preserve-3d',
                  transform: 'translateZ(0)', // Force GPU acceleration
                }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden w-12 flex justify-end">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-textSecondary hover:text-secondary transition-colors p-2"
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
                className="fixed inset-0 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-xl z-[9997]"
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
                className="fixed top-0 left-0 right-0 bg-primary/95 backdrop-blur-xl shadow-xl z-[9999]"
                style={{
                  transformStyle: isMobile ? 'flat' : 'preserve-3d',
                  transform: 'translateZ(0)', // Force GPU acceleration
                }}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-secondary/20 px-4 py-4">
                    <motion.h2 
                      className="text-xl font-bold text-secondary"
                      whileHover={hoverAnimation}
                      style={{
                        transformStyle: isMobile ? 'flat' : 'preserve-3d',
                        transform: 'translateZ(0)', // Force GPU acceleration
                      }}
                    >
                      Menu
                    </motion.h2>
                    <div className="w-12 flex justify-end">
                      <motion.button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-textSecondary hover:text-secondary hover:bg-secondary/10 transition-colors"
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
                        className="block rounded-lg px-4 py-3 text-textSecondary hover:text-secondary hover:bg-secondary/10 transition-colors"
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
                  
                  <div className="border-t border-secondary/20 p-4">
                    <motion.a
                      href="#contact"
                      onClick={() => setIsOpen(false)}
                      className="block w-full rounded-lg bg-secondary px-4 py-3 text-center text-primary hover:bg-secondary/90 transition-colors"
                      whileHover={hoverAnimation}
                      whileTap={tapAnimation}
                      style={{
                        transformStyle: isMobile ? 'flat' : 'preserve-3d',
                        transform: 'translateZ(0)', // Force GPU acceleration
                      }}
                    >
                      Contact Me
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
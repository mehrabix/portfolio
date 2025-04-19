import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import About from './components/About'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import Skills from './components/Skills'
import { LanguageProvider } from './context/LanguageContext'
import './i18n'; // Import i18n initialization

// Add global styles for section spacing
import './index.css'

// Define type for section visibility data
interface SectionVisibility {
  [key: string]: {
    isIntersecting: boolean;
    ratio: number;
  }
}

function App() {
  const { i18n } = useTranslation()
  // Add loading state to prevent flickering during translation load
  const [loading, setLoading] = useState(true)
  const { scrollY } = useScroll()
  const opacityLayer1 = useTransform(scrollY, [0, 300], [0.8, 0])
  const opacityLayer2 = useTransform(scrollY, [0, 700], [0, 0.5])
  // Track current section for URL updates
  const [activeSection, setActiveSection] = useState('hero')
  const isManualNavigation = useRef(false)
  // Store section visibility data
  const sectionVisibility = useRef<SectionVisibility>({})

  useEffect(() => {
    // First check if i18n is initialized
    if (i18n.isInitialized) {
      setLoading(false)
    } else {
      // Add event listener for initialization
      const handleInitialized = () => {
        setLoading(false)
      }
      i18n.on('initialized', handleInitialized)
      
      // Short delay as fallback
      const timer = setTimeout(() => {
        setLoading(false)
      }, 300)
      
      return () => {
        clearTimeout(timer)
        i18n.off('initialized', handleInitialized)
      }
    }
  }, [i18n])

  // Set up Intersection Observer for section detection
  useEffect(() => {
    // Skip if this is manual navigation or still loading
    if (loading) return

    const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'contact']
    
    // Update section visibility state
    const updateActiveSection = () => {
      // Calculate which section is most visible
      let maxVisibleSection: string | null = null
      let maxVisibleRatio = 0
      
      // Special case for very bottom of page - select last section
      const isAtBottom = window.innerHeight + Math.round(window.scrollY) >= document.body.offsetHeight - 10
      
      if (isAtBottom) {
        // We're at the bottom, so the last section should be active
        maxVisibleSection = 'contact'
      } else {
        // Otherwise find the most visible section based on stored visibility data
        for (const [section, data] of Object.entries(sectionVisibility.current)) {
          if (data.ratio > maxVisibleRatio) {
            maxVisibleRatio = data.ratio
            maxVisibleSection = section
          }
        }
      }
      
      // If we have a visible section and it's different from the current active section
      if (maxVisibleSection && maxVisibleSection !== activeSection) {
        setActiveSection(maxVisibleSection)
        // Update URL without triggering a new scroll
        const newUrl = maxVisibleSection === 'hero' ? window.location.pathname : `#${maxVisibleSection}`
        window.history.replaceState(null, '', newUrl)
      }
    }

    // Set up intersection observer to monitor sections
    const observerOptions = {
      root: null, // use viewport
      rootMargin: "0px",
      threshold: buildThresholdList(20) // create multiple thresholds for accuracy
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Store visibility data for each section
        sectionVisibility.current[entry.target.id] = {
          isIntersecting: entry.isIntersecting,
          ratio: entry.intersectionRatio
        }
      })
      
      // Skip updating during manual navigation
      if (!isManualNavigation.current) {
        updateActiveSection()
      }
    }, observerOptions)
    
    // Observe all sections
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })
    
    // Handle scroll events for edge cases
    const handleScroll = () => {
      if (isManualNavigation.current) {
        isManualNavigation.current = false
        return
      }
      updateActiveSection()
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      // Clean up observer and event listener
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId)
        if (element) {
          observer.unobserve(element)
        }
      })
      window.removeEventListener('scroll', handleScroll)
    }
  }, [activeSection, loading])

  // Helper function to build multiple threshold steps for more precision
  function buildThresholdList(numSteps: number): number[] {
    const thresholds: number[] = []
    for (let i = 0; i <= numSteps; i++) {
      thresholds.push(i / numSteps)
    }
    return thresholds
  }

  // Handle hash changes in URL (when user clicks nav links)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        isManualNavigation.current = true
        setActiveSection(hash)
        // Scroll to the section with a slight delay to ensure DOM is ready
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            // Calculate exact scroll position accounting for navbar height
            const navbarHeight = 64; // Approximate height of the navbar
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - navbarHeight;
            
            // Use smooth scrolling for better UX
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100)
      }
    }
    
    // Initial check
    if (window.location.hash) {
      handleHashChange()
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Handle initial page load navigation, especially after refresh
  useEffect(() => {
    // This effect runs once after the component mounts and i18n is loaded
    if (!loading) {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        // Use a slightly longer delay to ensure everything is properly rendered
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            // Calculate exact scroll position accounting for navbar height
            const navbarHeight = 64; // Approximate height of the navbar
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - navbarHeight;
            
            // Use immediate scrolling for initial page load
            window.scrollTo({
              top: offsetPosition
            });
            
            // Update the active section
            setActiveSection(hash)
          }
        }, 300)
      }
    }
  }, [loading]); // Only run when loading state changes to false

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black" style={{ position: 'fixed' }}>
        <div className="relative h-24 w-24" style={{ position: 'relative' }}>
          <div className="animate-ping absolute h-full w-full rounded-full bg-blue-500 opacity-10"></div>
          <div className="animate-spin absolute inset-0 h-full w-full rounded-full border-t-2 border-r-2 border-blue-500"></div>
          <div className="animate-pulse absolute inset-0 flex items-center justify-center text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <div className="mt-4 text-blue-500 font-light tracking-widest animate-pulse">LAUNCHING</div>
      </div>
    )
  }

  return (
    <LanguageProvider>
      <div className="relative bg-black" style={{ position: 'relative' }}>
        {/* 3D Background */}
        <div className="fixed inset-0 -z-10 pointer-events-none bg-black" style={{ position: 'fixed' }}>
          <Canvas>
            <Suspense fallback={null}>
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Suspense>
          </Canvas>
        </div>

        {/* Parallax Overlay Layers */}
        <motion.div 
          className="fixed inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/10 pointer-events-none z-[-5]"
          style={{ opacity: opacityLayer1, position: 'fixed' }}
        />
        <motion.div 
          className="fixed inset-0 bg-gradient-to-t from-blue-600/5 to-transparent pointer-events-none z-[-5]"
          style={{ opacity: opacityLayer2, position: 'fixed' }}
        />

        {/* Content */}
        <div className="relative z-10" style={{ position: 'relative' }}>
          <Navbar currentSection={activeSection} />
          <main style={{ position: 'relative' }} className="space-y-0">
            <Hero />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Contact />
          </main>
          
          {/* Scroll Progress Indicator */}
          <ScrollProgressBar />
        </div>
      </div>
    </LanguageProvider>
  )
}

// Scroll Progress Bar Component
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll({
    layoutEffect: false // Add this to prevent layout thrashing
  })
  
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 z-50"
      style={{ 
        scaleX: scrollYProgress,
        transformOrigin: "0% 50%",
        backgroundSize: "200% 100%",
        position: "fixed"
      }}
    />
  )
}

export default App

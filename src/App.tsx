import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import { LanguageProvider } from './context/LanguageContext'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import './i18n' // Import i18n initialization

function App() {
  const { i18n } = useTranslation()
  // Add loading state to prevent flickering during translation load
  const [loading, setLoading] = useState(true)
  const { scrollY } = useScroll()
  const opacityLayer1 = useTransform(scrollY, [0, 300], [0.8, 0])
  const opacityLayer2 = useTransform(scrollY, [0, 700], [0, 0.5])

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

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black" style={{ position: 'fixed' }}>
        <div className="relative h-24 w-24" style={{ position: 'relative' }}>
          <div className="animate-ping absolute h-full w-full rounded-full bg-blue-500 opacity-20"></div>
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
      <div className="relative" style={{ position: 'relative' }}>
        {/* 3D Background */}
        <div className="fixed inset-0 -z-10 pointer-events-none" style={{ position: 'fixed' }}>
          <Canvas>
            <Suspense fallback={null}>
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Suspense>
          </Canvas>
        </div>

        {/* Parallax Overlay Layers */}
        <motion.div 
          className="fixed inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 pointer-events-none z-[-5]"
          style={{ opacity: opacityLayer1, position: 'fixed' }}
        />
        <motion.div 
          className="fixed inset-0 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none z-[-5]"
          style={{ opacity: opacityLayer2, position: 'fixed' }}
        />

        {/* Content */}
        <div className="relative z-10" style={{ position: 'relative' }}>
          <Navbar />
          <main style={{ position: 'relative' }}>
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
  const { scrollYProgress } = useScroll()
  
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

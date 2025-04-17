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
import './i18n' // Import i18n initialization

function App() {
  const { i18n } = useTranslation()
  // Add loading state to prevent flickering during translation load
  const [loading, setLoading] = useState(true)

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
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <LanguageProvider>
      <div className="relative">
        {/* 3D Background */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <Canvas>
            <Suspense fallback={null}>
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Suspense>
          </Canvas>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Contact />
          </main>
        </div>
      </div>
    </LanguageProvider>
  )
}

export default App

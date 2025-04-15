import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas, ThreeEvent, extend, useFrame, PrimitiveProps, GroupProps, AmbientLightProps, PointLightProps } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// Import our standalone components
import CelestialObject from './CelestialObject'
import Moon from './Moon'
import MusicPlayer from './MusicPlayer'
import SkySphere from './SkySphere'
import SpacePortal from './SpacePortal'
import WormHole from './WormHole'
import Mars from './Mars'
import SolventCursor from './SolventCursor'

// Import TestTexture for debugging

// Vite-specific import for texture
// The path should be relative to this file

// Add global styles
const globalStyles = `
  .drop-shadow-glow {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
  }
`;

// Extend THREE elements to React Three Fiber
extend({ 
  PointLight: THREE.PointLight,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  MeshBasicMaterial: THREE.MeshBasicMaterial,
  BufferGeometry: THREE.BufferGeometry,
  BufferAttribute: THREE.BufferAttribute,
  Points: THREE.Points,
  PointsMaterial: THREE.PointsMaterial,
  AmbientLight: THREE.AmbientLight,
  Group: THREE.Group, 
  Object3D: THREE.Object3D,
  primitive: THREE.Object3D,
  group: THREE.Group,
  ambientLight: THREE.AmbientLight,
  pointLight: THREE.PointLight
})

// Extend intrinsic elements for TypeScript recognition
declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: PrimitiveProps;
      group: GroupProps;
      ambientLight: AmbientLightProps;
      pointLight: PointLightProps;
    }
  }
}

const InteractiveStars = () => {
  const starsRef = useRef<THREE.Points>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', checkMobile)
    checkMobile() // Initial check
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useFrame(() => {
    if (!starsRef.current) return

    // Reduced animation intensity on mobile
    const intensity = isMobile ? 0.00002 : 0.00005
    starsRef.current.rotation.x += (mousePosition.y * intensity - starsRef.current.rotation.x) * 0.1
    starsRef.current.rotation.y += (mousePosition.x * intensity - starsRef.current.rotation.y) * 0.1
  })

  return (
    <group onPointerMove={(e: ThreeEvent<PointerEvent>) => {
      if (isMobile) return
      const { clientX, clientY } = e
      setMousePosition({
        x: (clientX / window.innerWidth) * 2 - 1,
        y: -(clientY / window.innerHeight) * 2 + 1
      })
    }}>
      <Stars
        ref={starsRef}
        radius={100}
        depth={50}
        count={isMobile ? 2500 : 5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </group>
  )
}

const FloatingText = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', checkMobile)
    checkMobile() // Initial check
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold pointer-events-none"
      animate={{
        y: [0, -20, 0],
        opacity: [0.5, 1, 0.5],
        x: isMobile ? 0 : mousePosition.x * 20,
        rotateX: isMobile ? 0 : mousePosition.y * 10,
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        x: { duration: 0.2 },
        rotateX: { duration: 0.2 },
      }}
      style={{
        textShadow: '0 0 10px rgba(255,255,255,0.5)',
        perspective: isMobile ? 'none' : '1000px',
      }}
    >
    </motion.div>
  )
}

const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Create particles using useMemo
  const particleSystem = useMemo(() => {
    const count = window.innerWidth < 768 ? 500 : 1000
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: "#ffffff",
      transparent: true,
      opacity: 0.6
    })
    
    return new THREE.Points(geometry, material)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', checkMobile)
    checkMobile() // Initial check
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Store reference to the particle system
    particlesRef.current = particleSystem
    
    return () => {
      // Clean up
      particleSystem.geometry.dispose()
      if (particleSystem.material instanceof THREE.Material) {
        particleSystem.material.dispose()
      }
    }
  }, [particleSystem])

  useFrame((state) => {
    if (particleSystem) {
      particleSystem.rotation.y += isMobile ? 0.0005 : 0.001
    }
  })

  return (
    <primitive object={particleSystem} />
  )
}

const TouchHint = () => {
  const [show, setShow] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', checkMobile)
    checkMobile() // Initial check
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 5000) // Hide after 5 seconds

    return () => clearTimeout(timer)
  }, [])

  // On mobile, use the ScrollDownButton instead
  if (isMobile || !show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-lg">Move mouse to interact</span>
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-6 h-10 border-2 border-white rounded-full p-2"
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const ScrollDownButton = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  // Define the order of sections
  const sectionOrder = ['hero', 'about', 'experience', 'skills', 'projects', 'contact']

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', checkMobile)
    checkMobile() // Initial check
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return

      const sections = sectionOrder.map(id => document.getElementById(id))
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const nextSection = sections[i + 1]

        if (section && nextSection) {
          const sectionTop = section.offsetTop
          const nextSectionTop = nextSection.offsetTop

          if (scrollPosition >= sectionTop && scrollPosition < nextSectionTop) {
            setCurrentSectionIndex(i)
            break
          }
        } else if (section && !nextSection) {
          if (scrollPosition >= section.offsetTop) {
            setCurrentSectionIndex(i)
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isScrolling])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      setIsScrolling(true)
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      
      // Reset scrolling state after animation completes
      setTimeout(() => {
        setIsScrolling(false)
      }, 1000) // Adjust timing based on your scroll animation duration
    }
  }

  const handleScrollDown = () => {
    if (isScrolling) return

    const nextIndex = currentSectionIndex + 1
    if (nextIndex >= sectionOrder.length) {
      scrollToSection('hero')
      setCurrentSectionIndex(0)
    } else {
      scrollToSection(sectionOrder[nextIndex])
      setCurrentSectionIndex(nextIndex)
    }
  }

  const handleScrollToTop = () => {
    if (isScrolling) return
    scrollToSection('hero')
    setCurrentSectionIndex(0)
  }

  // Only render on mobile devices
  if (!isMobile) return null

  const isLastSection = currentSectionIndex === sectionOrder.length - 1

  return (
    <motion.button
      onClick={isLastSection ? handleScrollToTop : handleScrollDown}
      onTouchEnd={isLastSection ? handleScrollToTop : handleScrollDown}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        y: [0, 10, 0] 
      }}
      transition={{
        opacity: { delay: 1, duration: 0.5 },
        y: { 
          delay: 1.5,
          duration: 1.5, 
          repeat: Infinity,
          repeatType: "reverse"
        }
      }}
      className="fixed bottom-11 right-4 z-50 text-white flex flex-col items-center cursor-pointer"
      aria-label={isLastSection ? "Scroll to top" : "Scroll down"}
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
      disabled={isScrolling}
    >
      <motion.div
        animate={{
          y: [0, 5, 0]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="drop-shadow-glow"
          style={{
            transform: isLastSection ? 'rotate(180deg)' : 'none'
          }}
        >
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </motion.div>
    </motion.button>
  )
}

const GlowingOrb = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', checkMobile)
    checkMobile() // Initial check
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <motion.div
      className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"
      animate={{
        scale: isMobile ? 1 : [1, 1.2, 1],
        opacity: isMobile ? 0.3 : [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      style={{
        top: '20%',
        left: '20%',
      }}
    />
  )
}

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', checkMobile)
    checkMobile()
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
    >
      <div className="text-center">
        <motion.div
          className="relative w-64 h-64 mx-auto mb-8"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-lg" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white text-xl font-medium mb-4"
        >
          Loading Portfolio
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-400 text-sm mt-2"
        >
          {progress}%
        </motion.div>
      </div>
    </motion.div>
  )
}

const Hero = () => {
  const [showContent, setShowContent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  // Create scene lights
  const ambientLight = useMemo(() => new THREE.AmbientLight(0xffffff, 1.0), []);
  const pointLight = useMemo(() => {
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    return light;
  }, []);

  // Inject global styles
  useEffect(() => {
    // Inject the global styles
    const styleElement = document.createElement('style')
    styleElement.innerHTML = globalStyles
    document.head.appendChild(styleElement)
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', checkMobile)
    checkMobile() // Initial check
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => {
        setShowContent(true)
      }, 500)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Background Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={1.0} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          {/* Background sky */}
          <SkySphere />
          
          {/* Celestial objects */}
          <CelestialObject position={[0, 0, -60]} size={15} color="#8860d0" />
          <WormHole position={[-30, 15, -50]} size={8} />
          <SpacePortal position={[30, -12, -50]} size={6} ringCount={4} />
          
          {/* Main objects */}
          <Moon />
          <Mars position={[15, 5, -20]} size={1.5} />
          <InteractiveStars />
          <ParticleField />
          
          {/* Solvent Cursor Effect */}
          <SolventCursor color="#50c2ff" size={0.08} intensity={1.2} />
          
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Music Player */}
      <MusicPlayer />

      {/* For debugging texture loading */}
      {/* <TestTexture /> */}

      {/* Glowing Orbs */}
      <GlowingOrb />
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl"
        animate={{
          scale: isMobile ? 1 : [1, 1.2, 1],
          opacity: isMobile ? 0.3 : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
        style={{
          bottom: '20%',
          right: '20%',
        }}
      />

      {/* Floating Text */}
      <FloatingText />

      {/* Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              x: isMobile ? 0 : mousePosition.x * 10,
              rotateX: isMobile ? 0 : mousePosition.y * 5,
            }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.8,
              x: { duration: 0.2 },
              rotateX: { duration: 0.2 },
            }}
            className="relative z-10 text-center"
            style={{
              perspective: isMobile ? 'none' : '1000px',
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              style={{
                textShadow: '0 0 20px rgba(59,130,246,0.5)',
              }}
            >
              Ahmad Mehrabi
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8"
              style={{
                textShadow: '0 0 10px rgba(255,255,255,0.3)',
              }}
            >
              Full Stack Software Engineer
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center gap-4"
            >
              <motion.a
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59,130,246,0.5)' }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="cursor-pointer px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
              >
                <span className="relative z-10">Contact Me</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI hints - show different components based on device type */}
      <TouchHint />
      <ScrollDownButton />
    </section>
  )
}

export default Hero 
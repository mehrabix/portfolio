import { OrbitControls, Sphere, Stars, Text3D, Float, useTexture, Html } from '@react-three/drei'
import { Canvas, useFrame, ThreeEvent, extend } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'

// Import our standalone components
import Moon from './Moon'
import SkySphere from './SkySphere'
import CelestialObject from './CelestialObject'
import WormHole from './WormHole'
import SpacePortal from './SpacePortal'

// Import TestTexture for debugging
import TestTexture from './TestTexture'

// Vite-specific import for texture
// The path should be relative to this file
import moonMapUrl from '../assets/textures/moon/moon_map.jpg';

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
  // Add missing primitive and group elements
  primitive: 'primitive',
  group: 'group',
  ambientLight: 'ambientLight',
  pointLight: 'pointLight'
})

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', checkMobile)
    checkMobile() // Initial check
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleScrollDown = () => {
    const nextSection = document.getElementById('about') || document.querySelector('section:nth-of-type(2)')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If no next section is found, just scroll down one viewport height
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      })
    }
  }
  
  return (
    <motion.button
      onClick={handleScrollDown}
      onTouchEnd={handleScrollDown} // Ensure touch events are handled
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
      className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 text-white flex flex-col items-center cursor-pointer"
      aria-label="Scroll down"
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span className="text-sm mb-2 font-medium">{isMobile ? "Tap to scroll down" : "Scroll Down"}</span>
      <motion.div
        animate={{
          y: [0, 5, 0]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className={`p-2 rounded-full ${isMobile ? 'bg-white/10 backdrop-blur-sm' : ''}`}
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
          className={isMobile ? 'drop-shadow-glow' : ''}
        >
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </motion.div>
    </motion.button>
  )
}

const ParticleTrail = () => {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; opacity: number }>>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticle = {
          x: mousePosition.x,
          y: mousePosition.y,
          size: Math.random() * 4 + 2,
          opacity: 1
        }
        return [...prev.slice(-20), newParticle]
      })
    }, 50)

    return () => clearInterval(interval)
  }, [mousePosition])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute bg-white rounded-full"
          initial={{ 
            x: particle.x, 
            y: particle.y,
            scale: 1,
            opacity: particle.opacity
          }}
          animate={{ 
            x: particle.x + (Math.random() - 0.5) * 100,
            y: particle.y + (Math.random() - 0.5) * 100,
            scale: 0,
            opacity: 0
          }}
          transition={{
            duration: 1,
            ease: "easeOut"
          }}
          style={{
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </div>
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

const Hero = () => {
  const [showContent, setShowContent] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  // Create scene lights
  const ambientLight = useMemo(() => new THREE.AmbientLight(0xffffff, 0.5), []);
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
      setShowContent(true)
    }, 1000)
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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          {/* Background sky */}
          <SkySphere />
          
          {/* Celestial objects */}
          <CelestialObject position={[0, 0, -60]} size={15} color="#8860d0" />
          <WormHole position={[-30, 15, -50]} size={8} />
          <SpacePortal position={[30, -12, -50]} size={6} ringCount={4} />
          
          {/* Main objects */}
          <Moon />
          <InteractiveStars />
          <ParticleField />
          
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

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

      {/* Particle Trail */}
      <ParticleTrail />

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
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
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
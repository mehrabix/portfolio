import { OrbitControls, Sphere, Stars, Text3D, Float } from '@react-three/drei'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const Moon = () => {
  const moonRef = useRef<THREE.Mesh>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useFrame((state) => {
    if (!moonRef.current) return

    // Smooth rotation based on mouse position
    moonRef.current.rotation.x += (mousePosition.y * 0.0001 - moonRef.current.rotation.x) * 0.1
    moonRef.current.rotation.y += (mousePosition.x * 0.0001 - moonRef.current.rotation.y) * 0.1

    // Gentle floating animation
    moonRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
  })

  return (
    <Sphere 
      ref={moonRef} 
      args={[0.5, 64, 64]} 
      position={[2, 1, 0]}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        const { clientX, clientY } = e
        setMousePosition({
          x: (clientX / window.innerWidth) * 2 - 1,
          y: -(clientY / window.innerHeight) * 2 + 1
        })
      }}
    >
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.2}
        roughness={0.8}
        metalness={0.2}
      />
    </Sphere>
  )
}

const InteractiveStars = () => {
  const starsRef = useRef<THREE.Points>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useFrame(() => {
    if (!starsRef.current) return

    // Smooth rotation based on mouse position
    starsRef.current.rotation.x += (mousePosition.y * 0.00005 - starsRef.current.rotation.x) * 0.1
    starsRef.current.rotation.y += (mousePosition.x * 0.00005 - starsRef.current.rotation.y) * 0.1
  })

  return (
    <group onPointerMove={(e: ThreeEvent<PointerEvent>) => {
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
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </group>
  )
}

const SkySphere = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return

    // Gentle floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
  })

  const handleInteraction = () => {
    setHasInteracted(true)
  }

  return (
    <group onPointerMove={handleInteraction}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshPhongMaterial
          color="#1a365d"
          transparent
          opacity={0.8}
        />
      </Sphere>
      {!hasInteracted && (
        <Sphere args={[1.1, 32, 32]}>
          <meshPhongMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
    </group>
  )
}

const FloatingText = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold pointer-events-none"
      animate={{
        y: [0, -20, 0],
        opacity: [0.5, 1, 0.5],
        x: mousePosition.x * 20,
        rotateX: mousePosition.y * 10,
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
        perspective: '1000px',
      }}
    >
    </motion.div>
  )
}

const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null)
  const [particles] = useState(() => {
    const count = 1000
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  })

  useFrame((state) => {
    if (!particlesRef.current) return
    particlesRef.current.rotation.y += 0.001
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ffffff"
        transparent
        opacity={0.6}
      />
    </points>
  )
}

const TouchHint = () => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 5000) // Hide after 5 seconds

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

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
        <span className="text-lg">Touch and move to interact</span>
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
  return (
    <motion.div
      className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <SkySphere />
          <Moon />
          <InteractiveStars />
          <ParticleField />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Glowing Orbs */}
      <GlowingOrb />
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
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
              x: mousePosition.x * 10,
              rotateX: mousePosition.y * 5,
            }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.8,
              x: { duration: 0.2 },
              rotateX: { duration: 0.2 },
            }}
            className="relative z-10 text-center"
            style={{
              perspective: '1000px',
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

      {/* Touch Hint */}
      <TouchHint />
    </section>
  )
}

export default Hero 
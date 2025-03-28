import { OrbitControls, Sphere, Stars } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
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
      onPointerMove={(e) => {
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
    <group onPointerMove={(e) => {
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
  const [mousePosition, _] = useState({ x: 0, y: 0 })
  const [hasInteracted, setHasInteracted] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return

    // Smooth rotation based on mouse position
    meshRef.current.rotation.x += (mousePosition.y * 0.0001 - meshRef.current.rotation.x) * 0.1
    meshRef.current.rotation.y += (mousePosition.x * 0.0001 - meshRef.current.rotation.y) * 0.1

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

const Hero = () => {
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
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          Ahmad Mehrabi
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-8"
        >
          Full Stack Software Engineer
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center gap-4"
        >
          <a
            href="#contact"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Me
          </a>
          <a
            href="#projects"
            className="px-8 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            View Projects
          </a>
        </motion.div>
      </div>

      {/* Touch Hint */}
      <TouchHint />
    </section>
  )
}

export default Hero 
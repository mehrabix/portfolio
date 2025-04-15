import { useFrame, useLoader } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

// Import texture using Vite's asset imports
import marsMapUrl from '../assets/textures/mars_texture.jpg';

const Mars = ({ position = [0, 0, 0], size = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  // Use the imported URL
  const texture = useLoader(THREE.TextureLoader, marsMapUrl)

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial map={texture} roughness={0.9} metalness={0.1} />
    </mesh>
  )
}

export default Mars 
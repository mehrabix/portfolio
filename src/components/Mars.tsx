import { useFrame, useLoader } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// Import texture - supports WebP if available (add mars_texture.webp alongside .jpg)
// Vite will automatically handle the import, and you can add .webp version for optimization
import marsMapUrl from '../assets/textures/mars_texture.jpg';

const Mars = ({ position = [0, 0, 0], size = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  // Use the imported URL
  const texture = useLoader(THREE.TextureLoader, marsMapUrl)
  
  // Optimize texture settings for better performance
  useMemo(() => {
    if (texture) {
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      // Enable texture compression if supported
      texture.format = THREE.RGBAFormat;
    }
  }, [texture])

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
import { useRef, useState, useMemo, useEffect } from 'react';
import { Sphere, Stars, Float } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

// Import textures using Vite's asset imports
import moonMapUrl from '../assets/textures/moon/moon_map.jpg';

const Moon = () => {
  const moonRef = useRef<THREE.Mesh>(null);
  const craterRef = useRef<THREE.Mesh>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [textureError, setTextureError] = useState(false);
  const [textureLoaded, setTextureLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Initial check
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load texture with proper error handling
  const moonTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      moonMapUrl,
      () => {
        console.log('Moon texture loaded successfully');
        setTextureLoaded(true);
      },
      undefined,
      (error) => {
        console.error('Error loading moon texture:', error);
        setTextureError(true);
      }
    );
    
    // Apply texture settings
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }, []);

  // Create a fallback material
  const fallbackMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#e0e0e0',
      roughness: 0.7,
      metalness: 0.2
    });
  }, []);

  const moonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: textureError ? null : moonTexture,
      color: '#e0e0e0',
      roughness: 0.8,
      metalness: 0.2,
      emissive: '#333333',
      emissiveIntensity: 0.05
    });
  }, [moonTexture, textureError]);

  // Create lights
  const moonLight = useMemo(() => {
    const light = new THREE.PointLight('#d8e8ff', 1.5, 10, 2);
    light.position.set(0, 0, 0);
    return light;
  }, []);

  // Add lights to the moon
  useEffect(() => {
    if (moonRef.current) {
      moonRef.current.add(moonLight);
    }
    return () => {
      if (moonRef.current) {
        moonRef.current.remove(moonLight);
      }
    };
  }, [moonLight]);

  // Moon animation
  useFrame((state, delta) => {
    if (!moonRef.current) return;

    // Rotation based on mouse position
    const intensity = isMobile ? 0.00005 : 0.0001;
    moonRef.current.rotation.x += (mousePosition.y * intensity - moonRef.current.rotation.x) * 0.1;
    moonRef.current.rotation.y += (mousePosition.x * intensity - moonRef.current.rotation.y) * 0.1;
    
    // Natural rotation
    moonRef.current.rotation.y += delta * 0.05;
    
    // Gentle floating
    moonRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    
    // Sync crater rotation
    if (craterRef.current) {
      craterRef.current.rotation.copy(moonRef.current.rotation);
    }
    
    // Animate light intensity
    if (moonLight) {
      moonLight.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const handleMouseMove = (e: ThreeEvent<PointerEvent>) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    setMousePosition({
      x: (clientX / window.innerWidth) * 2 - 1,
      y: -(clientY / window.innerHeight) * 2 + 1
    });
  };

  return (
    <Float 
      position={[2, 1, 0]} 
      speed={1.5} 
      rotationIntensity={0.1} 
      floatIntensity={0.2}
    >
      {/* Main moon */}
      <Sphere 
        ref={moonRef} 
        args={[0.5, isMobile ? 32 : 64, isMobile ? 32 : 64]} 
        material={textureLoaded ? moonMaterial : fallbackMaterial}
        onPointerMove={handleMouseMove}
      />
      
      {/* Removed the problematic Stars component */}
    </Float>
  );
};

export default Moon; 
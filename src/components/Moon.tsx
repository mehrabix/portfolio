import { useRef, useState, useMemo, useEffect } from 'react';
import { Sphere, Float } from '@react-three/drei';
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
  const textureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Initial check
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create empty texture in useMemo with better settings
  const moonTexture = useMemo(() => {
    // Create a simple fallback texture for quicker initial rendering
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(0, 0, 128, 128);
    }
    const texture = new THREE.CanvasTexture(canvas);
    
    // Apply texture settings
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    textureRef.current = texture;
    return texture;
  }, []);

  // Handle texture loading in useEffect with improved error handling
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    // Add timeout to detect loading issues
    const timeoutId = setTimeout(() => {
      if (!textureLoaded) {
        console.warn('Moon texture loading timeout - using fallback');
        setTextureError(true);
      }
    }, 5000);
    
    loader.load(
      moonMapUrl,
      (loadedTexture) => {
        console.log('Moon texture loaded successfully');
        clearTimeout(timeoutId);
        if (textureRef.current) {
          textureRef.current.image = loadedTexture.image;
          textureRef.current.needsUpdate = true;
          setTextureLoaded(true);
        }
      },
      undefined,
      (error) => {
        console.error('Error loading moon texture:', error);
        clearTimeout(timeoutId);
        setTextureError(true);
      }
    );
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Create a better fallback material
  const fallbackMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#e0e0e0',
      roughness: 0.7,
      metalness: 0.2,
      // Add some noise to make it look more like a moon
      bumpScale: 0.02,
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

  // Create lights with better settings
  const moonLight = useMemo(() => {
    const light = new THREE.PointLight('#ffffff', 2, 5, 2);
    light.position.set(0, 0, 2);
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
      moonLight.intensity = 1.8 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
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
      {/* Main moon with improved visibility */}
      <Sphere 
        ref={moonRef} 
        args={[0.5, isMobile ? 32 : 64, isMobile ? 32 : 64]} 
        material={textureLoaded ? moonMaterial : fallbackMaterial}
        onPointerMove={handleMouseMove}
        position={[0, 0, 0]} // Ensure correct position
        castShadow
        receiveShadow
      />
    </Float>
  );
};

export default Moon; 
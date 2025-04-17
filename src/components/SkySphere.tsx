import { useRef, useState, useEffect, useMemo } from 'react';
import { Sphere, useGLTF } from '@react-three/drei';
import { useFrame, ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

// Import sky texture using Vite's asset imports
import skyMapUrl from '../assets/textures/sky/sky_map.jpg';

const SkySphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [textureLoaded, setTextureLoaded] = useState(false);

  // Client-side-only logic wrapped in useEffect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Initial check
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load sky texture - moved inside useEffect to prevent render-time state updates
  const skyTexture = useMemo(() => {
    // Create base texture that will be updated after loading
    const texture = new THREE.Texture();
    
    // Return the texture immediately without loading during SSR
    return texture;
  }, []);

  // Move texture loading to useEffect to happen after component mount
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      skyMapUrl,
      (loadedTexture) => {
        console.log('Sky texture loaded successfully');
        skyTexture.image = loadedTexture.image;
        skyTexture.needsUpdate = true;
        
        // Apply texture settings
        skyTexture.minFilter = THREE.LinearFilter;
        skyTexture.magFilter = THREE.LinearFilter;
        skyTexture.mapping = THREE.EquirectangularReflectionMapping;
        
        setTextureLoaded(true);
      },
      undefined,
      (error) => {
        console.error('Error loading sky texture:', error);
      }
    );
  }, [skyTexture]);

  // Create materials
  const skyMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide, // Important: render on inside of sphere
      transparent: true,
      opacity: 0.8
    });
  }, [skyTexture]);

  // Fallback material
  const fallbackMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#1a365d',
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.8,
    });
  }, []);

  // Interactive glow effect
  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
  }, []);

  // Gentle animation
  useFrame((state) => {
    if (!meshRef.current) return;

    // Subtle rotation
    meshRef.current.rotation.y += 0.0005;
    
    // Gentle floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });

  const handleInteraction = () => {
    if (isMobile) return;
    setHasInteracted(true);
  };

  return (
    <>
      {/* Main sky sphere */}
      <Sphere 
        ref={meshRef} 
        args={[90, isMobile ? 32 : 64, isMobile ? 32 : 64]}
        material={textureLoaded ? skyMaterial : fallbackMaterial}
        onPointerMove={handleInteraction}
      />
      
      {/* Interactive glow effect - only show before interaction */}
      {!hasInteracted && !isMobile && (
        <Sphere 
          args={[91, 32, 32]} 
          material={glowMaterial}
        />
      )}
    </>
  );
};

export default SkySphere; 
import { useRef, useState, useEffect, useMemo } from 'react';
import { Sphere } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useWindowSize } from '../hooks/useWindowSize';
import { usePerformanceMode } from '../hooks/usePerformanceMode';

// Import sky texture using Vite's asset imports
import skyMapUrl from '../assets/textures/sky/sky_map.jpg';

const SkySphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { isMobile } = useWindowSize();
  const { reduceAnimations } = usePerformanceMode();
  const [textureLoaded, setTextureLoaded] = useState(false);
  const textureRef = useRef<THREE.Texture | null>(null);
  const lastUpdateRef = useRef(0);

  // Create texture instance without loading in useMemo
  const skyTexture = useMemo(() => {
    const texture = new THREE.Texture();
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    textureRef.current = texture;
    return texture;
  }, []);

  // Handle texture loading in useEffect
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      skyMapUrl,
      (loadedTexture) => {
        console.log('Sky texture loaded successfully');
        if (textureRef.current) {
          textureRef.current.image = loadedTexture.image;
          textureRef.current.needsUpdate = true;
          setTextureLoaded(true);
        }
      },
      undefined,
      (error) => {
        console.error('Error loading sky texture:', error);
      }
    );
  }, []);

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
      color: '#000',
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

  // Gentle animation - throttled
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Throttle to ~30fps
    const now = performance.now();
    if (now - lastUpdateRef.current < 33) return;
    lastUpdateRef.current = now;

    // Disable animations on low-end devices
    if (reduceAnimations || isMobile) {
      // Minimal or no animation
      return;
    }

    // Reduced rotation speed
    meshRef.current.rotation.y += 0.0003; // Reduced from 0.0005
    
    // Reduced floating
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.03; // Reduced
  });

  const handleInteraction = () => {
    if (isMobile) return;
    setHasInteracted(true);
  };

  return (
    <group onPointerMove={handleInteraction}>
      {/* Main sky sphere */}
      <Sphere 
        ref={meshRef} 
        args={[90, isMobile ? 16 : 32, isMobile ? 16 : 32]}
        material={textureLoaded ? skyMaterial : fallbackMaterial}
      />
      
      {/* Interactive glow effect - only show before interaction */}
      {!hasInteracted && !isMobile && (
        <Sphere 
          args={[91, 32, 32]} 
          material={glowMaterial}
        />
      )}
    </group>
  );
};

export default SkySphere; 

import { useRef, useMemo } from 'react';
import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useWindowSize } from '../hooks/useWindowSize';
import { usePerformanceMode } from '../hooks/usePerformanceMode';

// Import sky texture using Vite's asset imports
import skyMapUrl from '../assets/textures/sky/sky_map.jpg';

const SkySphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { isMobile } = useWindowSize();
  const { reduceAnimations } = usePerformanceMode();
  const lastUpdateRef = useRef(0);

  // Load texture with proper filtering to prevent pixelation
  const texture = useLoader(THREE.TextureLoader, skyMapUrl);
  
  // Configure texture to prevent pixelation - use proper filters
  useMemo(() => {
    if (!texture) return;
    // Use high-quality filtering to prevent pixelation
    texture.minFilter = THREE.LinearMipmapLinearFilter; // Best quality for minification
    texture.magFilter = THREE.LinearFilter; // Smooth scaling
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.generateMipmaps = true;
    texture.anisotropy = 16; // High anisotropy for better quality at angles
    texture.wrapS = THREE.ClampToEdgeWrapping; // Prevent edge artifacts
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.flipY = false; // Important for equirectangular
  }, [texture]);

  // Create material with better settings to prevent pixelation
  const skyMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide, // Render on inside of sphere
      fog: false, // Disable fog for sky
      depthWrite: false, // Prevent depth issues
      depthTest: false, // Sky should always render
    });
  }, [texture]);

  // Gentle animation - throttled
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Throttle to ~30fps
    const now = performance.now();
    if (now - lastUpdateRef.current < 33) return;
    lastUpdateRef.current = now;

    // Disable animations on low-end devices
    if (reduceAnimations || isMobile) {
      return;
    }

    // Minimal rotation
    meshRef.current.rotation.y += 0.0002;
  });

  // Use higher resolution sphere to prevent pixelation
  // Increase segments for smoother appearance
  const segments = isMobile ? 48 : 64;
  
  return (
    <Sphere 
      ref={meshRef} 
      args={[90, segments, segments]}
      material={skyMaterial}
    />
  );
};

export default SkySphere; 

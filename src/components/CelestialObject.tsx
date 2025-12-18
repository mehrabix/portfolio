import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Create a celestial object (galaxy/nebula) with procedural texture
const CelestialObject = ({ position = [0, 0, -60], size = 15, color = '#8860d0' }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Initial check
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create procedural texture for the galaxy
  const galaxyTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Create radial gradient for galaxy
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    
    // Add color stops for a nebula/galaxy-like appearance
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.2, color.replace('0', '8'));
    gradient.addColorStop(0.4, 'rgba(136, 96, 208, 0.4)');
    gradient.addColorStop(0.6, 'rgba(136, 96, 208, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add some "stars" to the galaxy
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Create swirling pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      for (let j = 0; j < Math.PI * 8; j += 0.1) {
        const radius = j * size / 20;
        const x = size / 2 + Math.cos(j) * radius / Math.PI;
        const y = size / 2 + Math.sin(j) * radius / Math.PI;
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [color]);

  // Materials for the galaxy
  const galaxyMaterial = useMemo(() => {
    if (!galaxyTexture) return null;
    return new THREE.MeshBasicMaterial({
      map: galaxyTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, [galaxyTexture]);

  // Animation - throttled and simplified
  let lastUpdate = 0;
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Throttle to ~30fps
    const now = performance.now();
    if (now - lastUpdate < 33) return;
    lastUpdate = now;

    // Slow rotation - reduced
    meshRef.current.rotation.z += 0.0003; // Reduced from 0.0005
    
    // Subtle floating - reduced
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.15; // Reduced
    
    // Breathe effect - reduced
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.2) * 0.03; // Reduced
    meshRef.current.scale.set(scale, scale, scale);
  });

  if (!galaxyMaterial) return null;

  return (
    <group position={position}>
      <Sphere 
        ref={meshRef} 
        args={[size, 32, 32]} 
        material={galaxyMaterial}
      />
    </group>
  );
};

export default CelestialObject; 
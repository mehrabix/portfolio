import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere, Ring } from '@react-three/drei';

// Create a space portal with animated rings
const SpacePortal = ({ position = [30, 10, -50], size = 6, ringCount = 3 }) => {
  const portalRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Initial check
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create a glowing material for the portal center
  const portalMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#4cc9f0'),
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
  }, []);

  // Create materials for the rings with different colors
  const ringMaterials = useMemo(() => {
    const colors = ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0'];
    return Array(ringCount).fill(0).map((_, i) => {
      return new THREE.MeshBasicMaterial({
        color: new THREE.Color(colors[i % colors.length]),
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
    });
  }, [ringCount]);

  // Generate random particles around the portal
  const particles = useMemo(() => {
    const count = isMobile ? 50 : 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (Math.random() * size * 1.5) + size;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: '#ffffff',
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    return new THREE.Points(particleGeometry, particleMaterial);
  }, [size, isMobile]);

  // Animation
  useFrame((state) => {
    if (!portalRef.current || !ringsRef.current) return;
    
    // Slow rotation for the entire portal
    portalRef.current.rotation.z += 0.001;
    
    // Rotate each ring at different speeds
    if (ringsRef.current.children.length > 0) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.z += 0.003 * (i % 2 === 0 ? 1 : -1);
      });
    }
    
    // Pulse effect
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    portalRef.current.scale.set(scale, scale, 1);
    
    // Update particle positions
    if (particles.geometry instanceof THREE.BufferGeometry) {
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        // Move particles slightly
        positions[i + 2] = Math.sin(state.clock.elapsedTime + i) * 0.5;
      }
      particles.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={portalRef} position={position} rotation={[0, Math.PI / 6, 0]}>
      {/* Portal center */}
      <Sphere args={[size * 0.7, 32, 32]} material={portalMaterial} />
      
      {/* Rotating rings */}
      <group ref={ringsRef}>
        {Array(ringCount).fill(0).map((_, i) => (
          <Ring 
            key={i}
            args={[
              size * (0.8 + i * 0.15), // inner radius
              size * (0.9 + i * 0.15), // outer radius
              32 // segments
            ]} 
            rotation={[Math.PI / 2, 0, 0]}
            material={ringMaterials[i]} 
          />
        ))}
      </group>
      
      {/* Particles around the portal */}
      <primitive object={particles} />
    </group>
  );
};

export default SpacePortal; 
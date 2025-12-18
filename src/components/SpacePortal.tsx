import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere, Ring } from '@react-three/drei';

// Create a space portal with cosmic energy download effect
const SpacePortal = ({ position = [30, 10, -50], size = 6, ringCount = 3 }) => {
  const portalRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const energyStreamRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Initial check
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create a shader material for the portal center
  const portalMaterial = useMemo(() => {
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      
      void main() {
        vec2 center = vUv - 0.5;
        float dist = length(center);
        
        // Create swirling pattern
        float angle = atan(center.y, center.x);
        float swirl = sin(angle * 5.0 + dist * 10.0 - time * 2.0) * 0.5 + 0.5;
        
        // Create rings
        float rings = sin(dist * 20.0 - time * 3.0) * 0.5 + 0.5;
        
        // Combine effects
        float pattern = mix(swirl, rings, 0.5);
        
        // Create color gradient
        vec3 color1 = vec3(0.3, 0.6, 0.9); // Light blue
        vec3 color2 = vec3(0.6, 0.3, 0.9); // Purple
        vec3 color = mix(color1, color2, pattern);
        
        // Add some noise
        float noise = fract(sin(dot(center, vec2(12.9898, 78.233))) * 43758.5453);
        color += noise * 0.1;
        
        // Fade out at edges
        float alpha = smoothstep(0.5, 0.2, dist);
        
        gl_FragColor = vec4(color, alpha);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, []);

  // Create materials for the rings with different colors
  const ringMaterials = useMemo(() => {
    const colors = ['#4cc9f0', '#4361ee', '#3a0ca3', '#7209b7', '#f72585'];
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

  // Create energy stream geometry
  const energyStreamGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const count = 200;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 8; // More twists
      const radius = t * size * 3; // Longer stream
      
      // Create a spiral pattern
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = t * size * 4;
      
      // Vary the size along the stream
      scales[i] = (1 - t) * 0.3;
      
      // Create color gradient
      const color = new THREE.Color('#4cc9f0');
      color.lerp(new THREE.Color('#f72585'), t);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geometry;
  }, [size]);

  // Create energy stream material
  const energyStreamMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Generate particles around the portal
  const particles = useMemo(() => {
    const count = isMobile ? 100 : 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (Math.random() * size * 1.5) + size;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      
      // Random velocities for more natural movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    
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

  // Animation - heavily throttled for performance
  let lastUpdate = 0;
  useFrame((state) => {
    if (!portalRef.current || !ringsRef.current || !energyStreamRef.current) return;
    
    // Throttle to ~20fps for complex animations
    const now = performance.now();
    if (now - lastUpdate < 50) return; // ~20fps for complex animations
    lastUpdate = now;
    
    // Update shader time - slower
    if (portalMaterial instanceof THREE.ShaderMaterial) {
      portalMaterial.uniforms.time.value = state.clock.elapsedTime * 0.7; // Slower
    }
    
    // Slow rotation - reduced
    portalRef.current.rotation.z += 0.0005; // Reduced from 0.001
    
    // Rotate each ring - reduced
    if (ringsRef.current.children.length > 0) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.z += 0.002 * (i % 2 === 0 ? 1 : -1); // Reduced from 0.003
      });
    }
    
    // Animate energy stream - reduced
    energyStreamRef.current.rotation.z += 0.01; // Reduced from 0.02
    energyStreamRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.3; // Reduced
    
    // Skip particle updates on low-end devices or reduce frequency
    if (isMobile) return; // Skip particles on mobile
    
    // Update particle positions - only every other frame
    if (particles.geometry instanceof THREE.BufferGeometry && now % 100 < 50) {
      const positions = particles.geometry.attributes.position.array;
      const velocities = particles.geometry.attributes.velocity.array;
      
      // Update fewer particles per frame
      const step = 2; // Update every other particle
      for (let i = 0; i < positions.length; i += 3 * step) {
        positions[i] += velocities[i] * 0.5; // Slower movement
        positions[i + 1] += velocities[i + 1] * 0.5;
        positions[i + 2] += velocities[i + 2] * 0.5;
        
        // Simplified bounds check
        const dist = Math.sqrt(positions[i] * positions[i] + positions[i + 1] * positions[i + 1]);
        if (dist > size * 2) {
          const angle = Math.atan2(positions[i + 1], positions[i]);
          positions[i] = Math.cos(angle) * size * 1.5;
          positions[i + 1] = Math.sin(angle) * size * 1.5;
        }
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
      
      {/* Energy stream effect */}
      <group ref={energyStreamRef}>
        <points geometry={energyStreamGeometry} material={energyStreamMaterial} />
      </group>
      
      {/* Particles around the portal */}
      <primitive object={particles} />
    </group>
  );
};

export default SpacePortal; 
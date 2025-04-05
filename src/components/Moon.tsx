import { useRef, useState, useMemo, useEffect } from 'react';
import { Sphere, Float, Trail } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

// Import textures using Vite's asset imports
import moonMapUrl from '../assets/textures/moon/moon_map.jpg';

const Moon = () => {
  const moonRef = useRef<THREE.Mesh>(null);
  const craterRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [textureError, setTextureError] = useState(false);
  const [textureLoaded, setTextureLoaded] = useState(false);

  // New dynamic animation values
  const rotationSpeed = useMemo(() => 0.05 + Math.random() * 0.03, []);
  const floatIntensity = useMemo(() => 0.2 + Math.random() * 0.1, []);

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

  // Create enhanced effect materials
  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#4169E1').multiplyScalar(1.5),
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });
  }, []);

  // Enhanced atmosphere material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#6495ED').multiplyScalar(2.5) },
        viewVector: { value: new THREE.Vector3(0, 0, 1) }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vec3 vNormal = normalize(normalMatrix * normal);
          intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying float intensity;
        void main() {
          float glowFactor = sin(time * 0.5) * 0.1 + 0.9;
          vec3 glow = color * intensity * 1.5 * glowFactor;
          gl_FragColor = vec4(glow, 1.0);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
  }, []);

  const moonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: textureError ? null : moonTexture,
      color: '#e0e0e0',
      roughness: 0.8,
      metalness: 0.2,
      emissive: '#333333',
      emissiveIntensity: 0.05,
      // Add some shininess to make it more appealing
      envMapIntensity: 1.5
    });
  }, [moonTexture, textureError]);

  // Create enhanced moon particles
  const moonParticles = useMemo(() => {
    const count = isMobile ? 100 : 200;
    const particlePositions = new Float32Array(count * 3);
    const particleSizes = new Float32Array(count);
    const radius = 0.55;
    
    for (let i = 0; i < count; i++) {
      // Create positions around the moon's surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      
      particleSizes[i] = Math.random() * 0.015 + 0.002;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    const material = new THREE.PointsMaterial({
      size: 0.01,
      color: new THREE.Color('#4F9EFF'),
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    return new THREE.Points(geometry, material);
  }, [isMobile]);

  // Create enhanced lights
  const moonLight = useMemo(() => {
    const light = new THREE.PointLight('#d8e8ff', 2, 10, 2);
    light.position.set(0, 0, 0);
    return light;
  }, []);

  // Add lights to the moon
  useEffect(() => {
    if (moonRef.current) {
      moonRef.current.add(moonLight);
      moonRef.current.add(moonParticles);
    }
    return () => {
      if (moonRef.current) {
        moonRef.current.remove(moonLight);
        moonRef.current.remove(moonParticles);
      }
    };
  }, [moonLight, moonParticles]);

  // Enhanced moon animation
  useFrame((state, delta) => {
    if (!moonRef.current) return;

    // Update atmosphere shader time uniform
    if (atmosphereMaterial.uniforms) {
      atmosphereMaterial.uniforms.time.value = state.clock.elapsedTime;
      atmosphereMaterial.uniforms.viewVector.value = new THREE.Vector3(0, 0, 1).applyQuaternion(state.camera.quaternion);
    }

    // Rotation based on mouse position - more responsive
    const intensity = isMobile ? 0.00008 : 0.00015;
    moonRef.current.rotation.x += (mousePosition.y * intensity - moonRef.current.rotation.x) * 0.15;
    moonRef.current.rotation.y += (mousePosition.x * intensity - moonRef.current.rotation.y) * 0.15;
    
    // Natural rotation - varying speed
    moonRef.current.rotation.y += delta * rotationSpeed * (isHovered ? 1.5 : 1);
    
    // Gentle floating with more dynamic movement
    moonRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    moonRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    
    // Sync crater rotation
    if (craterRef.current) {
      craterRef.current.rotation.copy(moonRef.current.rotation);
    }
    
    // Animate light intensity - more dynamic
    if (moonLight) {
      moonLight.intensity = 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      moonLight.color.setStyle(isHovered ? '#e0f7ff' : '#d8e8ff');
    }

    // Update atmosphere
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.copy(moonRef.current.rotation);
    }

    // Animate particles
    if (moonParticles) {
      const particlePositions = moonParticles.geometry.attributes.position.array;
      const count = particlePositions.length / 3;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = particlePositions[i3];
        const y = particlePositions[i3 + 1];
        const z = particlePositions[i3 + 2];
        
        // Add subtle movement to particles
        const angle = state.clock.elapsedTime * 0.2 + i;
        particlePositions[i3] = x + Math.sin(angle) * 0.002;
        particlePositions[i3 + 1] = y + Math.cos(angle) * 0.002;
        particlePositions[i3 + 2] = z + Math.sin(angle * 0.5) * 0.002;
      }
      
      moonParticles.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate scale on hover without using React animation
    if (isHovered && moonRef.current.scale.x < 1.1) {
      moonRef.current.scale.set(
        moonRef.current.scale.x + 0.02 * delta * 60,
        moonRef.current.scale.y + 0.02 * delta * 60,
        moonRef.current.scale.z + 0.02 * delta * 60
      );
    } else if (!isHovered && moonRef.current.scale.x > 1) {
      moonRef.current.scale.set(
        moonRef.current.scale.x - 0.02 * delta * 60,
        moonRef.current.scale.y - 0.02 * delta * 60,
        moonRef.current.scale.z - 0.02 * delta * 60
      );
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

  const handleHover = (entering: boolean) => {
    setIsHovered(entering);
  };

  return (
    <Float 
      position={[2, 1, 0]} 
      speed={1.8} 
      rotationIntensity={0.15} 
      floatIntensity={floatIntensity}
    >
      {/* Enhanced outer glow effect */}
      <Sphere args={[0.8, 32, 32]} material={glowMaterial} />
      
      {/* Dynamic atmospheric effect */}
      <Sphere
        ref={atmosphereRef}
        args={[0.65, 32, 32]}
        material={atmosphereMaterial}
      />
      
      {/* Main moon with animated scale on hover - using group instead of motion.group */}
      <group
        ref={moonRef}
        onPointerMove={handleMouseMove}
        onPointerEnter={() => handleHover(true)}
        onPointerLeave={() => handleHover(false)}
      >
        <Sphere args={[0.5, isMobile ? 32 : 64, isMobile ? 32 : 64]} material={textureLoaded ? moonMaterial : fallbackMaterial} />
        
        {/* Add subtle trail effect for visual interest */}
        <Trail
          width={0.05}
          length={3}
          color={new THREE.Color('#4169E1').multiplyScalar(1.5)}
          attenuation={(width) => width * 0.5}
          local={false}
        >
          <Sphere args={[0.01]} position={[0, 0.6, 0]} visible={false}>
            <primitive object={new THREE.MeshBasicMaterial({ color: "#ffffff" })} attach="material" />
          </Sphere>
        </Trail>
      </group>
    </Float>
  );
};

export default Moon; 
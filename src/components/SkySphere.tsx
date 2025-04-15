import { useRef, useState, useEffect, useMemo } from 'react';
import { Sphere } from '@react-three/drei';
import { useFrame, ThreeEvent, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Import sky texture using Vite's asset imports
import skyMapUrl from '../assets/textures/sky/sky_map.jpg';

// Custom dissolve shader
const dissolveMaterial = `
  uniform sampler2D map;
  uniform float time;
  uniform vec2 cursorPosition;
  uniform float dissolveRadius;
  uniform float dissolveStrength;
  uniform vec3 dissolveColor;

  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(map, vUv);
    
    // Calculate distance from cursor in UV space
    float dist = distance(vUv, cursorPosition);
    
    // Create dissolve effect
    float dissolveEdge = smoothstep(dissolveRadius, dissolveRadius - 0.1, dist);
    
    // Add ripple effects
    float ripple = sin(dist * 20.0 - time * 3.0) * 0.2;
    dissolveEdge += ripple * smoothstep(dissolveRadius + 0.2, dissolveRadius - 0.2, dist);
    
    // Mix with dissolve color
    vec3 finalColor = mix(texColor.rgb, dissolveColor, dissolveEdge * dissolveStrength);
    
    // Add glow at the edge
    float glow = smoothstep(dissolveRadius + 0.05, dissolveRadius - 0.05, dist) - 
                smoothstep(dissolveRadius - 0.05, dissolveRadius - 0.15, dist);
    finalColor += glow * dissolveColor * 0.5;
    
    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

const SkySphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const dissolveShaderRef = useRef<THREE.ShaderMaterial>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0.5, y: 0.5 });
  const { viewport } = useThree();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Initial check
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Monitor cursor position for dissolve effect
  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Convert screen coordinates to UV coordinates (0-1)
      setCursorPosition({
        x: e.clientX / window.innerWidth,
        y: 1.0 - (e.clientY / window.innerHeight) // Flip Y for shader
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Load sky texture
  const skyTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      skyMapUrl,
      () => {
        console.log('Sky texture loaded successfully');
        setTextureLoaded(true);
      },
      undefined,
      (error) => {
        console.error('Error loading sky texture:', error);
      }
    );
    
    // Apply texture settings
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    
    return texture;
  }, []);

  // Create shader material with dissolve effect
  const createDissolveMaterial = useMemo(() => {
    if (!skyTexture) return null;
    
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: skyTexture },
        time: { value: 0 },
        cursorPosition: { value: new THREE.Vector2(0.5, 0.5) },
        dissolveRadius: { value: 0.1 },
        dissolveStrength: { value: 0.5 },
        dissolveColor: { value: new THREE.Color('#50c2ff') }
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: dissolveMaterial,
      side: THREE.BackSide,
      transparent: true
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

  // Gentle animation and update shader uniforms
  useFrame((state) => {
    if (!meshRef.current) return;

    // Subtle rotation
    meshRef.current.rotation.y += 0.0005;
    
    // Gentle floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    
    // Update shader uniforms
    if (dissolveShaderRef.current && textureLoaded) {
      dissolveShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
      dissolveShaderRef.current.uniforms.cursorPosition.value.set(
        cursorPosition.x, 
        cursorPosition.y
      );
      
      // Pulse the dissolve effect
      const pulseAmount = (Math.sin(state.clock.elapsedTime * 2) * 0.02) + 0.05;
      dissolveShaderRef.current.uniforms.dissolveRadius.value = pulseAmount + 0.05;
    }
  });

  const handleInteraction = () => {
    if (isMobile) return;
    setHasInteracted(true);
  };

  return (
    <group onPointerMove={handleInteraction}>
      {/* Main sky sphere with dissolve shader */}
      <Sphere 
        ref={meshRef} 
        args={[90, isMobile ? 32 : 64, isMobile ? 32 : 64]}
        material={textureLoaded && createDissolveMaterial ? createDissolveMaterial : fallbackMaterial}
      />
      
      {/* Apply ref to shader material if available */}
      {textureLoaded && createDissolveMaterial && (
        <primitive 
          object={createDissolveMaterial} 
          ref={dissolveShaderRef}
        />
      )}
      
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
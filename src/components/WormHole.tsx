import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Create a wormhole effect with procedural animation
const WormHole = ({ position = [0, 0, -40], size = 8 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Initial check
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create a shader material for the wormhole
  const wormholeMaterial = useMemo(() => {
    // Vertex shader - responsible for the mesh's position/deformation
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment shader - responsible for the color/appearance
    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      const float PI = 3.14159265359;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
        // Calculate center distance
        vec2 center = vUv - 0.5;
        float dist = length(center);
        
        // Create some rings
        float rings = sin(dist * 50.0 - time * 2.0) * 0.5 + 0.5;
        
        // Add some swirls
        float angle = atan(center.y, center.x);
        float swirl = sin(angle * 10.0 + dist * 20.0 - time * 3.0) * 0.5 + 0.5;
        
        // Combine effects
        float pattern = mix(rings, swirl, 0.5);
        
        // Create a blue/purple gradient moving from center
        vec3 color1 = vec3(0.1, 0.2, 0.5); // Dark blue
        vec3 color2 = vec3(0.6, 0.3, 0.9); // Purple
        vec3 color = mix(color2, color1, dist * 2.0);
        
        // Fade out at the edges
        float alpha = smoothstep(0.5, 0.2, dist);
        
        // Add some random "stars"
        float stars = step(0.98, random(vUv * 100.0));
        color += stars * vec3(1.0);
        
        // Apply the pattern to the color
        color *= pattern * 2.0;
        
        gl_FragColor = vec4(color, alpha);
      }
    `;

    // Create shader material with the shaders defined above
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

  // Animation
  useFrame((state) => {
    if (!meshRef.current || !wormholeMaterial) return;

    // Update time uniform for the shader
    wormholeMaterial.uniforms.time.value = state.clock.elapsedTime;
    
    // Rotation animation
    meshRef.current.rotation.z += 0.001;
    
    // Subtle pulse effect
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    meshRef.current.scale.set(scale, scale, 1);
  });

  return (
    <mesh position={position}>
      <Sphere 
        ref={meshRef} 
        args={[size, 64, 64]} 
        material={wormholeMaterial}
      />
    </mesh>
  );
};

export default WormHole; 
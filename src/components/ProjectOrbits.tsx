import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitProps {
  radius: number;
  speed: number;
  color: string;
  emissive?: string;
  size?: number;
}

const Orbit: React.FC<OrbitProps> = ({ 
  radius, 
  speed, 
  color,
  emissive = color,
  size = 0.15
}) => {
  const orbitRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const clock = new THREE.Clock();
  
  useFrame(() => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += speed * 0.005;
    }
    
    if (sphereRef.current) {
      // Add slight bobbing motion
      const time = clock.getElapsedTime();
      sphereRef.current.position.y = Math.sin(time * 2) * 0.05;
    }
  });
  
  return (
    <group ref={orbitRef}>
      {/* Circular path (invisible) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[radius, radius + 0.01, 32]} />
        <meshBasicMaterial color={color} opacity={0.1} transparent />
      </mesh>
      
      {/* Orbiting sphere */}
      <mesh 
        ref={sphereRef} 
        position={[radius, 0, 0]}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={emissive} 
          emissiveIntensity={0.8} 
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      
      {/* Trail effect */}
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[size * 0.7, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

interface PortalRingProps {
  radius: number;
  color: string;
  thickness?: number;
  speed?: number;
}

const PortalRing: React.FC<PortalRingProps> = ({ radius, color, thickness = 0.03, speed = 0.1 }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += speed * 0.01;
    }
  });
  
  return (
    <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
      <torusGeometry args={[radius, thickness, 16, 100]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.8}
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  );
};

const OrbitalSystem: React.FC = () => {
  return (
    <group position={[0, 0, -2]}>
      {/* Main core */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#1d4ed8" 
          emissive="#3b82f6" 
          emissiveIntensity={0.8}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
      </mesh>
      
      {/* Orbits */}
      <Orbit radius={1.2} speed={0.5} color="#3b82f6" size={0.1} />
      <Orbit radius={1.8} speed={0.3} color="#8b5cf6" size={0.15} />
      <Orbit radius={2.5} speed={0.2} color="#ec4899" size={0.12} />
      <Orbit radius={3.2} speed={0.15} color="#f59e0b" size={0.08} />
      
      {/* Portal rings */}
      <PortalRing radius={0.8} color="#3b82f6" thickness={0.02} speed={0.3} />
      <PortalRing radius={0.85} color="#8b5cf6" thickness={0.01} speed={-0.2} />
      
      {/* Ambient light */}
      <ambientLight intensity={0.2} />
      
      {/* Point lights for glow */}
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#3b82f6" distance={5} />
    </group>
  );
};

export default OrbitalSystem; 
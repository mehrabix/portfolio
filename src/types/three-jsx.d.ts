/// <reference types="@react-three/fiber" />
import { Object3DNode, MaterialNode, LightNode } from '@react-three/fiber'
import { Object3D, Material, Light } from 'three'
import * as THREE from 'three';
import type { ReactThreeFiber } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Add any missing elements here
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      meshPhongMaterial: any;
      meshBasicMaterial: any;
      pointsMaterial: any;
      pointLight: any;
      ambientLight: any;
      directionalLight: any;
      bufferGeometry: any;
      bufferAttribute: any;
      primitive: any;
      points: any;
      ring: any;
    }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    group: Object3DNode<THREE.Group, typeof THREE.Group>
    mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>
    points: Object3DNode<THREE.Points, typeof THREE.Points>
    
    // Lights
    ambientLight: LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>
    pointLight: LightNode<THREE.PointLight, typeof THREE.PointLight>
    directionalLight: LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>
    
    // Materials
    meshStandardMaterial: MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>
    meshPhongMaterial: MaterialNode<THREE.MeshPhongMaterial, typeof THREE.MeshPhongMaterial>
    meshBasicMaterial: MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>
    pointsMaterial: MaterialNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>
    
    // Geometry
    sphereGeometry: ReactThreeFiber.BufferGeometryNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>
    bufferGeometry: ReactThreeFiber.BufferGeometryNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>
    ring: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>
    
    // Attributes
    bufferAttribute: ReactThreeFiber.Node<THREE.BufferAttribute, typeof THREE.BufferAttribute>
    
    // Primitive
    primitive: ReactThreeFiber.Node<THREE.Object3D, typeof THREE.Object3D>
  }
}

declare module 'react' {
  interface HTMLAttributes<T> {
    // Add any additional HTML attributes that might be needed
  }
} 
/// <reference types="@react-three/fiber" />
import { Object3DNode, MaterialNode, LightNode } from '@react-three/fiber'
import { Object3D, Material, Light } from 'three'

declare module '@react-three/fiber' {
  interface ThreeElements {
    group: Object3DNode<Object3D, typeof Object3D>
    meshStandardMaterial: MaterialNode<Material, typeof Material>
    meshPhongMaterial: MaterialNode<Material, typeof Material>
    ambientLight: LightNode<Light, typeof Light>
    pointLight: LightNode<Light, typeof Light>
    directionalLight: LightNode<Light, typeof Light>
  }
}

declare module 'react' {
  interface HTMLAttributes<T> {
    // Add any additional HTML attributes that might be needed
  }
} 
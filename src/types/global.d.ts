/// <reference types="@react-three/fiber" />
/// <reference types="three" />
import { ThreeElements } from '@react-three/fiber'
import { Object3D } from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
      primitive: any;
      points: any;
      pointLight: any;
      ambientLight: any;
      mesh: any;
      group: any;
      bufferGeometry: any;
      bufferAttribute: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      meshPhongMaterial: any;
      ring: any;
      sphere: any;
      stars: any;
    }
  }
} 
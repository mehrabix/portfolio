/// <reference types="@react-three/fiber" />
/// <reference types="three" />
import { ThreeElements } from '@react-three/fiber'
import { Object3D } from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
} 
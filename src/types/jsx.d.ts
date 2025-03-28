import { ThreeElements } from '@react-three/fiber'

declare module 'react' {
  interface HTMLAttributes<T> extends ThreeElements {}
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
} 
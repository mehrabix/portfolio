import { ThreeElements } from '@react-three/fiber'
import { HTMLAttributes } from 'react'

declare module 'react' {
  interface HTMLAttributes<T> extends Omit<HTMLAttributes<T>, keyof ThreeElements> {}
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
} 
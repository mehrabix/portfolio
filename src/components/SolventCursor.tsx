import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

// Custom shader for the solvent effect
const fragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform vec2 mousePosition;
  uniform float radius;
  uniform vec3 color;
  
  void main() {
    // Convert pixel position to UV coordinates
    vec2 uv = gl_FragCoord.xy / resolution;
    
    // Calculate distance from mouse position
    float dist = distance(uv, mousePosition);
    
    // Create a circular solvent effect
    float circle = smoothstep(radius, radius - 0.1, dist);
    
    // Add some ripple effects
    float ripple = sin(dist * 30.0 - time * 5.0) * 0.1;
    circle += ripple * smoothstep(radius + 0.1, radius - 0.3, dist);
    
    // Create a glowing edge
    float glow = smoothstep(radius + 0.05, radius - 0.05, dist) - 
                 smoothstep(radius - 0.05, radius - 0.15, dist);
    
    // Combine effects
    vec3 finalColor = mix(vec3(0.0), color, circle) + glow * color;
    
    gl_FragColor = vec4(finalColor, 0.8);
  }
`

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

interface SolventCursorProps {
  color?: string;
  size?: number;
  intensity?: number;
}

interface ReactiveParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  life: number;
}

const SolventCursor = ({ 
  color = '#4cc9f0', 
  size = 0.06, 
  intensity = 1.0 
}: SolventCursorProps) => {
  const { viewport } = useThree()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const shaderRef = useRef<THREE.ShaderMaterial>(null)
  const [reactiveParticles, setReactiveParticles] = useState<ReactiveParticle[]>([])
  
  // Convert hex color to Three.js color
  const threeColor = useMemo(() => new THREE.Color(color), [color])

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', checkMobile)
    checkMobile() // Initial check
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle document-level mouse movements for DOM cursor
  useEffect(() => {
    if (isMobile) return
    
    // Create DOM cursor container
    const cursorContainer = document.createElement('div')
    cursorContainer.id = 'solvent-cursor-container'
    cursorContainer.style.position = 'fixed'
    cursorContainer.style.top = '0'
    cursorContainer.style.left = '0'
    cursorContainer.style.width = '100%'
    cursorContainer.style.height = '100%'
    cursorContainer.style.pointerEvents = 'none'
    cursorContainer.style.zIndex = '9999'
    cursorContainer.style.overflow = 'hidden'
    document.body.appendChild(cursorContainer)
    
    // Create main cursor element
    const cursorDiv = document.createElement('div')
    cursorDiv.style.position = 'absolute'
    cursorDiv.style.top = '0'
    cursorDiv.style.left = '0'
    cursorDiv.style.width = '80px'
    cursorDiv.style.height = '80px'
    cursorDiv.style.borderRadius = '50%'
    cursorDiv.style.transform = 'translate(-50%, -50%)'
    cursorDiv.style.opacity = '0'
    cursorDiv.style.mixBlendMode = 'screen'
    cursorDiv.style.filter = 'blur(8px)'
    cursorDiv.style.background = `radial-gradient(circle, ${color}, transparent 70%)`
    cursorDiv.style.boxShadow = `0 0 20px ${color}80, 0 0 40px ${color}40`
    cursorDiv.id = 'solvent-cursor'
    cursorContainer.appendChild(cursorDiv)
    
    // Create cursor inner core (more intense)
    const cursorCore = document.createElement('div')
    cursorCore.style.position = 'absolute'
    cursorCore.style.top = '50%'
    cursorCore.style.left = '50%'
    cursorCore.style.width = '30px'
    cursorCore.style.height = '30px'
    cursorCore.style.borderRadius = '50%'
    cursorCore.style.transform = 'translate(-50%, -50%)'
    cursorCore.style.background = `radial-gradient(circle, white, ${color} 70%)`
    cursorCore.style.boxShadow = `0 0 10px ${color}`
    cursorCore.style.filter = 'blur(2px)'
    cursorDiv.appendChild(cursorCore)
    
    // Add digital circuit lines
    const createCircuitLine = (angle: number, length: number) => {
      const line = document.createElement('div')
      line.style.position = 'absolute'
      line.style.top = '50%'
      line.style.left = '50%'
      line.style.width = `${length}px`
      line.style.height = '2px'
      line.style.backgroundColor = color
      line.style.boxShadow = `0 0 5px ${color}`
      line.style.transformOrigin = '0 50%'
      line.style.transform = `rotate(${angle}deg) translateY(-50%)`
      line.style.opacity = '0.7'
      cursorDiv.appendChild(line)
      
      // Animate line length
      const animateCircuitLine = () => {
        const randomLength = Math.random() * 20 + 40
        line.style.transition = 'width 0.3s ease-out'
        line.style.width = `${randomLength}px`
        setTimeout(() => {
          line.style.width = `${length}px`
        }, 300)
      }
      
      // Periodically animate lines
      const interval = setInterval(animateCircuitLine, Math.random() * 2000 + 1000)
      return interval
    }
    
    // Create circuit lines at different angles
    const intervals: number[] = []
    for (let i = 0; i < 5; i++) {
      const angle = i * 72
      const length = Math.random() * 30 + 40
      intervals.push(createCircuitLine(angle, length))
    }
    
    // Animate in
    setTimeout(() => {
      cursorDiv.style.transition = 'opacity 0.3s ease-in-out'
      cursorDiv.style.opacity = '0.9'
    }, 100)
    
    // Track mouse position and generate particles
    let lastX = 0
    let lastY = 0
    let lastParticleTime = 0
    
    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX
      const currentY = e.clientY
      
      // Update cursor position
      cursorDiv.style.transform = `translate(${currentX}px, ${currentY}px)`
      
      // Calculate mouse speed for reactive particles
      const speed = Math.sqrt(
        Math.pow(currentX - lastX, 2) + 
        Math.pow(currentY - lastY, 2)
      )
      
      // Generate particles based on mouse speed
      const now = performance.now()
      if (speed > 5 && now - lastParticleTime > 30) {
        lastParticleTime = now
        generateParticle(currentX, currentY, speed)
      }
      
      // Update shader uniform values
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: 1.0 - (e.clientY / window.innerHeight) // Flip Y for shader
      })
      
      lastX = currentX
      lastY = currentY
    }
    
    const generateParticle = (x: number, y: number, speed: number) => {
      // Create a particle element
      const particle = document.createElement('div')
      particle.style.position = 'absolute'
      particle.style.top = `${y}px`
      particle.style.left = `${x}px`
      
      // Random size based on mouse speed
      const size = Math.min(10, Math.max(3, speed / 5))
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      
      // Visual style
      particle.style.borderRadius = '50%'
      particle.style.backgroundColor = color
      particle.style.boxShadow = `0 0 ${size}px ${color}`
      particle.style.opacity = '0.8'
      particle.style.transform = 'translate(-50%, -50%)'
      particle.style.mixBlendMode = 'screen'
      
      // Add to DOM
      cursorContainer.appendChild(particle)
      
      // Calculate random velocity
      const angle = Math.random() * Math.PI * 2
      const velocity = speed * 0.2
      const vx = Math.cos(angle) * velocity
      const vy = Math.sin(angle) * velocity
      
      // Animate the particle
      let opacity = 0.8
      let currentX = x
      let currentY = y
      
      const animateParticle = () => {
        // Update position
        currentX += vx
        currentY += vy
        opacity -= 0.02
        
        // Apply changes
        particle.style.top = `${currentY}px`
        particle.style.left = `${currentX}px`
        particle.style.opacity = `${opacity}`
        
        // Continue animation or remove
        if (opacity > 0) {
          requestAnimationFrame(animateParticle)
        } else {
          cursorContainer.removeChild(particle)
        }
      }
      
      // Start animation
      requestAnimationFrame(animateParticle)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    
    // Use a style tag for custom cursor
    const styleTag = document.createElement('style')
    styleTag.innerHTML = `
      body { 
        cursor: none !important; 
      }
      a, button, [role="button"], .cursor-pointer {
        cursor: none !important;
      }
      @keyframes circuit-pulse {
        0% { opacity: 0.4; }
        50% { opacity: 0.8; }
        100% { opacity: 0.4; }
      }
    `
    document.head.appendChild(styleTag)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.body.removeChild(cursorContainer)
      document.head.removeChild(styleTag)
      intervals.forEach(clearInterval)
    }
  }, [isMobile, color])

  // Create shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mousePosition: { value: new THREE.Vector2(0.5, 0.5) },
        radius: { value: size },
        color: { value: threeColor }
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }, [size, threeColor])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (shaderRef.current) {
        shaderRef.current.uniforms.resolution.value.set(window.innerWidth, window.innerHeight)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Update shader uniforms on each frame
  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = state.clock.elapsedTime
      shaderRef.current.uniforms.mousePosition.value.set(
        mousePosition.x,
        mousePosition.y
      )
    }
  })

  // Don't render the WebGL part on mobile
  if (isMobile) return null

  // We're not returning any Three.js elements here to avoid type issues
  // Instead, we're just updating the shader uniforms through the useFrame hook
  // The actual solvent effect happens through the DOM cursor
  return null
}

export default SolventCursor 
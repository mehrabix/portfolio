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
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [isMobile, setIsMobile] = useState(false)
  const [isOverInteractive, setIsOverInteractive] = useState(false)
  const shaderRef = useRef<THREE.ShaderMaterial>(null)
  
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

  // Create and handle the DOM cursor
  useEffect(() => {
    if (isMobile) return

    console.log("Creating Solvent Cursor")
    
    // Add debug info (removed splash notification code)
    // Add a debug element to show cursor status
    const addDebugInfo = () => {
      const debugStyle = document.createElement('style')
      debugStyle.innerHTML = `
        #solvent-cursor-debug {
          position: fixed;
          bottom: 80px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 10001;
          pointer-events: none;
          font-family: monospace;
        }
      `
      document.head.appendChild(debugStyle)
      
      const debugEl = document.createElement('div')
      debugEl.id = 'solvent-cursor-debug'
      debugEl.textContent = 'Solvent Cursor: Active'
      document.body.appendChild(debugEl)
      
      return { debugStyle, debugEl }
    }
    
    // Create debug elements in development
    const isProduction = window.location.hostname !== 'localhost' && 
                         !window.location.hostname.includes('127.0.0.1');
    const debugElements = !isProduction ? addDebugInfo() : null
    
    // Remove any existing cursor containers first
    const existingContainer = document.getElementById('solvent-cursor-container')
    if (existingContainer) {
      document.body.removeChild(existingContainer)
    }
    
    // Create DOM cursor container
    const cursorContainer = document.createElement('div')
    cursorContainer.id = 'solvent-cursor-container'
    cursorContainer.style.position = 'fixed'
    cursorContainer.style.top = '0'
    cursorContainer.style.left = '0'
    cursorContainer.style.width = '100vw'
    cursorContainer.style.height = '100vh'
    cursorContainer.style.pointerEvents = 'none'
    cursorContainer.style.zIndex = '10000'
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
    cursorDiv.style.opacity = '0.7'
    cursorDiv.style.mixBlendMode = 'screen'
    cursorDiv.style.filter = 'blur(8px)'
    cursorDiv.style.background = `radial-gradient(circle, ${color}, transparent 70%)`
    cursorDiv.style.boxShadow = `0 0 20px ${color}80, 0 0 40px ${color}40`
    cursorDiv.id = 'solvent-cursor'
    cursorContainer.appendChild(cursorDiv)
    
    // Position cursor at initial mouse position or center of screen
    const initialX = window.innerWidth / 2
    const initialY = window.innerHeight / 2
    cursorDiv.style.transform = `translate(${initialX}px, ${initialY}px)`
    
    // Create cursor inner core (more intense)
    const cursorCore = document.createElement('div')
    cursorCore.style.position = 'absolute'
    cursorCore.style.top = '50%'
    cursorCore.style.left = '50%'
    cursorCore.style.width = '20px'
    cursorCore.style.height = '20px'
    cursorCore.style.borderRadius = '50%'
    cursorCore.style.transform = 'translate(-50%, -50%)'
    cursorCore.style.background = `radial-gradient(circle, white, ${color} 70%)`
    cursorCore.style.boxShadow = `0 0 10px ${color}`
    cursorCore.style.filter = 'blur(2px)'
    cursorCore.style.opacity = '0.7'
    cursorDiv.appendChild(cursorCore)
    
    // Create pointer cursor for interactive elements - making it invisible as we're showing the real cursor
    const pointerCursor = document.createElement('div')
    pointerCursor.style.position = 'absolute'
    pointerCursor.style.top = '50%'
    pointerCursor.style.left = '50%'
    pointerCursor.style.width = '24px'
    pointerCursor.style.height = '24px'
    pointerCursor.style.borderRadius = '50%'
    pointerCursor.style.transform = 'translate(-50%, -50%)'
    pointerCursor.style.border = `2px solid white`
    pointerCursor.style.opacity = '0' // Always keep it at 0 opacity
    pointerCursor.style.transition = 'opacity 0.2s ease, transform 0.2s ease'
    pointerCursor.id = 'pointer-cursor'
    cursorDiv.appendChild(pointerCursor)
    
    // Add click animation element
    const clickRipple = document.createElement('div')
    clickRipple.style.position = 'absolute'
    clickRipple.style.top = '50%'
    clickRipple.style.left = '50%'
    clickRipple.style.width = '30px'
    clickRipple.style.height = '30px'
    clickRipple.style.borderRadius = '50%'
    clickRipple.style.transform = 'translate(-50%, -50%) scale(0)'
    clickRipple.style.background = 'rgba(255, 255, 255, 0.6)'
    clickRipple.style.opacity = '0'
    clickRipple.id = 'click-ripple'
    cursorDiv.appendChild(clickRipple)
    
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
    
    // Track mouse position and generate particles
    let lastX = initialX
    let lastY = initialY
    let lastParticleTime = 0
    
    // Helper to check if an element is interactive
    const isInteractiveElement = (element: Element | null): boolean => {
      if (!element) return false
      
      // Direct checks for specific component IDs
      const specificInteractiveIds = [
        'music-player', 
        'about', 
        'experience', 
        'skills', 
        'projects', 
        'contact',
        'navbar'
      ]
      
      // Check for element ID or parent with ID
      if (element.id && specificInteractiveIds.some(id => element.id === id || element.id.includes(id))) {
        return true
      }
      
      const parentWithId = element.closest(`#${specificInteractiveIds.join(', #')}`)
      if (parentWithId) return true
      
      // Check for standard interactive elements
      const interactiveTags = [
        'A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 
        'AUDIO', 'VIDEO', 'SUMMARY', 'DETAILS', 'LABEL'
      ]
      
      // Check tag name
      if (interactiveTags.includes(element.tagName)) {
        return true
      }
      
      // Expanded list of interactive classes
      const interactiveClasses = [
        'cursor-pointer', 'clickable', 'interactive', 
        'group-hover', 'hover:', 'link', 'nav-link', 'btn',
        'motion', 'social', 'whileHover'
      ]
      
      // Check element classList
      const classList = Array.from(element.classList)
      for (const className of classList) {
        if (interactiveClasses.some(cls => className.includes(cls))) {
          return true
        }
      }
      
      // Check for interactive attributes
      const interactiveAttributes = [
        'onclick', 'role="button"', 'aria-controls', 'controls',
        'href', 'target', 'rel', 'whileHover', 'whileTap'
      ]
      
      // Check attributes
      for (const attr of interactiveAttributes) {
        const attrName = attr.split('=')[0]
        if (element.hasAttribute(attrName)) {
          return true
        }
      }
      
      // Check computed style for cursor property
      const style = window.getComputedStyle(element)
      if (style.cursor === 'pointer' || style.cursor === 'hand') {
        return true
      }
      
      // Special checks for common elements in portfolio
      
      // Check for social icons (used in About and Contact)
      if (
        element.closest('a') && 
        (element.classList.contains('text-3xl') || 
         element.closest('svg') || 
         element.closest('[class*="Fa"]'))
      ) {
        return true
      }
      
      // Check for nav items in Navbar
      if (element.closest('nav') && element.closest('a')) {
        return true
      }
      
      // Check for project cards in Projects
      if (element.closest('.group') && 
          (element.closest('a') || 
           element.closest('[whileHover]') || 
           element.closest('[class*="cursor"]'))
      ) {
        return true
      }
      
      // Check if element is inside a motion div
      if (element.closest('motion') || 
          element.hasAttribute('whileHover') || 
          element.hasAttribute('whileTap')) {
        return true
      }
      
      // Check parent elements recursively (limit to 3 levels to avoid performance issues)
      let depth = 0
      let parentElement = element.parentElement
      while (parentElement && depth < 3) {
        // Check parent tag
        if (interactiveTags.includes(parentElement.tagName)) {
          return true
        }
        
        // Check parent classList
        const parentClassList = Array.from(parentElement.classList)
        for (const className of parentClassList) {
          if (interactiveClasses.some(cls => className.includes(cls))) {
            return true
          }
        }
        
        // Check parent style
        const parentStyle = window.getComputedStyle(parentElement)
        if (parentStyle.cursor === 'pointer' || parentStyle.cursor === 'hand') {
          return true
        }
        
        parentElement = parentElement.parentElement
        depth++
      }
      
      return false
    }
    
    // Update debug info when mouse moves
    const updateDebugInfo = (x: number, y: number, isInteractive: boolean) => {
      if (!debugElements?.debugEl) return
      
      debugElements.debugEl.innerHTML = `
        Solvent Cursor: Active<br>
        Position: ${Math.round(x)}, ${Math.round(y)}<br>
        Interactive: ${isInteractive ? 'Yes' : 'No'}
      `
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorDiv) return

      const currentX = e.clientX
      const currentY = e.clientY
      
      // Get element under cursor
      const elementUnderCursor = document.elementFromPoint(currentX, currentY)
      const interactive = isInteractiveElement(elementUnderCursor)
      
      // Update debug info
      updateDebugInfo(currentX, currentY, interactive)
      
      // Update state
      setIsOverInteractive(interactive)
      
      // No need to update pointer cursor visibility since we're showing the real cursor
      // Keep the cursor effect size changes
      if (interactive) {
        cursorDiv.style.width = '60px'
        cursorDiv.style.height = '60px'
        cursorDiv.style.opacity = '0.4' // Further reduced for better cursor visibility
      } else {
        cursorDiv.style.width = '80px'
        cursorDiv.style.height = '80px'
        cursorDiv.style.opacity = '0.6' // Reduced for better cursor visibility
      }
      
      // Update cursor position
      cursorDiv.style.transform = `translate(${currentX}px, ${currentY}px)`
      
      // Calculate mouse speed for reactive particles
      const speed = Math.sqrt(
        Math.pow(currentX - lastX, 2) + 
        Math.pow(currentY - lastY, 2)
      )
      
      // Generate particles based on mouse speed and not over interactive elements
      const now = performance.now()
      if (!interactive && speed > 5 && now - lastParticleTime > 30) {
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
          if (particle.parentNode === cursorContainer) {
            cursorContainer.removeChild(particle)
          }
        }
      }
      
      // Start animation
      requestAnimationFrame(animateParticle)
    }
    
    // Handle mouse click animation
    const handleMouseDown = () => {
      if (isOverInteractive) {
        // Animate the click ripple
        clickRipple.style.transition = 'transform 0.3s ease, opacity 0.3s ease'
        clickRipple.style.transform = 'translate(-50%, -50%) scale(1)'
        clickRipple.style.opacity = '0.8'
        
        // Shrink the pointer cursor
        pointerCursor.style.transform = 'translate(-50%, -50%) scale(0.8)'
        
        // Reset after animation
        setTimeout(() => {
          clickRipple.style.transform = 'translate(-50%, -50%) scale(0)'
          clickRipple.style.opacity = '0'
          pointerCursor.style.transform = 'translate(-50%, -50%) scale(1)'
        }, 300)
      }
    }
    
    const handleMouseUp = () => {
      if (isOverInteractive) {
        pointerCursor.style.transform = 'translate(-50%, -50%) scale(1)'
      }
    }

    // Add all event listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    
    // Use a style tag for custom cursor
    const styleTag = document.createElement('style')
    styleTag.innerHTML = `
      body { 
        cursor: auto !important; /* Changed from 'none' to 'auto' to show the real cursor */
      }
      /* Allow regular cursor on interactive elements */
      a, button, [role="button"], .cursor-pointer, input, select, textarea, 
      [onclick], [id="music-player"], [id="music-player"] *, nav a, 
      [id="about"] a, [id="projects"] a, [id="contact"] a,
      .social-icon, .social-link, [whileHover], [whileTap],
      svg, .group a, [class*="motion"] a, [class*="Fa"] {
        cursor: pointer !important;
      }
      /* Removed hover effect style manipulation */
      @keyframes circuit-pulse {
        0% { opacity: 0.4; }
        50% { opacity: 0.8; }
        100% { opacity: 0.4; }
      }
    `
    document.head.appendChild(styleTag)
    
    return () => {
      console.log("Cleaning up Solvent Cursor")
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      
      // Safety check before removal
      if (cursorContainer && cursorContainer.parentNode === document.body) {
        document.body.removeChild(cursorContainer)
      }
      
      if (styleTag && styleTag.parentNode === document.head) {
        document.head.removeChild(styleTag)
      }
      
      intervals.forEach(clearInterval)
      
      // Remove debug elements
      if (debugElements) {
        if (debugElements.debugEl && debugElements.debugEl.parentNode) {
          debugElements.debugEl.parentNode.removeChild(debugElements.debugEl)
        }
        if (debugElements.debugStyle && debugElements.debugStyle.parentNode) {
          debugElements.debugStyle.parentNode.removeChild(debugElements.debugStyle)
        }
      }
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
      
      // Make interactive element effect less pronounced
      if (isOverInteractive) {
        shaderRef.current.uniforms.radius.value = Math.max(0.03, size * 0.6) // Less reduction
      } else {
        shaderRef.current.uniforms.radius.value = size
      }
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
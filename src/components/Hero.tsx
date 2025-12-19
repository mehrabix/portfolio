import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas, ThreeEvent, extend, useFrame, ReactThreeFiber } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react'
import * as THREE from 'three'
import { useLanguage } from '../context/LanguageContext'
import { useWindowSize } from '../hooks/useWindowSize'
import { useThrottledMouseMove } from '../hooks/useThrottledMouseMove'
import { usePerformanceMode } from '../hooks/usePerformanceMode'

// Import our standalone components
import CelestialObject from './CelestialObject'
import Mars from './Mars'
import Moon from './Moon'
import MusicPlayer from './MusicPlayer'
import SkySphere from './SkySphere'
import SpacePortal from './SpacePortal'
import WormHole from './WormHole'

// Import TestTexture for debugging

// Vite-specific import for texture
// The path should be relative to this file

// Import texture URLs for preloading
import marsMapUrl from '../assets/textures/mars_texture.jpg'
import moonMapUrl from '../assets/textures/moon/moon_map.jpg'
import skyMapUrl from '../assets/textures/sky/sky_map.jpg'
// Import any other textures your components might be using
// For example, if you have textures for SpacePortal or WormHole

// Add global styles
const globalStyles = `
  .drop-shadow-glow {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
  }
`;

// Define assets to preload
const assetsToPreload = [
  { id: 'mars', url: marsMapUrl },
  { id: 'moon', url: moonMapUrl },
  { id: 'sky', url: skyMapUrl },
  // Add more textures here as needed 
  // Example: { id: 'portal', url: portalMapUrl },
  // Uncomment and add any textures used by other components
];

// Create a context to track preloaded assets
import { createContext, useContext } from 'react';

type PreloadContextType = {
  loadedAssets: { [key: string]: boolean };
  progress: number;
};

const PreloadContext = createContext<PreloadContextType>({
  loadedAssets: {},
  progress: 0
});

const usePreloadContext = () => useContext(PreloadContext);

// Add a variable to track if we've loaded assets before - to avoid loading screen on page refreshes
let assetsAlreadyLoaded = false;

// Extend THREE elements to React Three Fiber
extend({ 
  PointLight: THREE.PointLight,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  MeshBasicMaterial: THREE.MeshBasicMaterial,
  BufferGeometry: THREE.BufferGeometry,
  BufferAttribute: THREE.BufferAttribute,
  Points: THREE.Points,
  PointsMaterial: THREE.PointsMaterial,
  AmbientLight: THREE.AmbientLight,
  Group: THREE.Group,
  Object3D: THREE.Object3D
})

// Asset Preloader component
const AssetPreloader = ({ onProgress, onComplete }: { onProgress: (progress: number) => void, onComplete: () => void }) => {
  useEffect(() => {
    // If assets were already loaded in a previous session, skip loading
    if (assetsAlreadyLoaded) {
      console.log('Assets already loaded in a previous session, skipping preload');
      onProgress(100);
      onComplete();
      return;
    }
    
    const textureLoader = new THREE.TextureLoader();
    console.log(`Starting to preload ${assetsToPreload.length} textures`);
    const totalAssets = assetsToPreload.length;
    
    let loadedCount = 0;
    let currentProgress = 0;
    const loadedAssets: { [key: string]: boolean } = {};
    
    // Minimum loading time for better UX (in milliseconds)
    const minLoadingTime = 2000;
    const startTime = Date.now();
    
    // Use a small buffer percentage for "other loading tasks" to make progress look more realistic
    // This gives the appearance of additional work happening even after all assets are loaded
    const initialBufferPercentage = 15; // Initial progress immediately
    const finalBufferPercentage = 10; // Reserved for final tasks
    const assetLoadingPercentage = 100 - initialBufferPercentage - finalBufferPercentage;
    
    // Track if we've completed loading
    let isCompleted = false;
    
    // Create a controlled progress updater that ensures progress only goes up
    const updateProgress = (newValue: number) => {
      if (isCompleted) return;
      
      // Ensure new value is always greater than current
      if (newValue > currentProgress) {
        currentProgress = Math.min(90, newValue); // Cap at 90% until fully complete
        onProgress(Math.round(currentProgress));
      }
    };
    
    // Simulate initial loading immediately
    updateProgress(initialBufferPercentage);
    
    // Add a timeout to force completion after a maximum time
    const forceCompleteTimeout = setTimeout(() => {
      console.log('Forcing completion of asset loading after timeout');
      assetsAlreadyLoaded = true; // Mark as loaded for future visits
      completeLoading();
    }, 10000); // Force complete after 10 seconds max
    
    // Helper function to determine if enough time has passed for minimum loading time
    const hasReachedMinLoadingTime = () => {
      return (Date.now() - startTime) >= minLoadingTime;
    };
    
    // Use a constant, steady progress simulation for smoother appearance
    const startSteadyProgress = () => {
      let steadyInterval = setInterval(() => {
        if (isCompleted) {
          clearInterval(steadyInterval);
          return;
        }
        
        // Calculate how far we should be in loading based on time elapsed
        const elapsedTime = Date.now() - startTime;
        const targetProgress = Math.min(
          90, // Max before completion
          initialBufferPercentage + 
            ((assetLoadingPercentage * 0.8) * // Use 80% of asset percentage for time-based progress
            Math.min(1, elapsedTime / minLoadingTime))
        );
        
        // Only update if higher than current
        updateProgress(targetProgress);
      }, 100);
      
      return () => clearInterval(steadyInterval);
    };
    
    // Start steady progress updates
    const clearSteadyProgress = startSteadyProgress();
    
    // Helper function to complete loading
    const completeLoading = () => {
      if (isCompleted) return;
      isCompleted = true;
      
      // Clean up timers
      clearTimeout(forceCompleteTimeout);
      clearSteadyProgress();
      
      // Ensure we show final progress steps smoothly
      const finalSteps = [92, 95, 98, 100];
      let stepIndex = 0;
      
      const finalInterval = setInterval(() => {
        if (stepIndex >= finalSteps.length) {
          clearInterval(finalInterval);
          
          // Complete the loading
          assetsAlreadyLoaded = true;
          onProgress(100);
          onComplete();
          return;
        }
        
        onProgress(finalSteps[stepIndex]);
        stepIndex++;
      }, 150);
    };
    
    // Start loading all textures
    assetsToPreload.forEach(asset => {
      console.log(`Loading texture: ${asset.id}`);
      textureLoader.load(
        asset.url,
        () => {
          loadedCount++;
          loadedAssets[asset.id] = true;
          console.log(`Loaded texture: ${asset.id} (${loadedCount}/${totalAssets})`);
          
          // Calculate progress based on loaded assets
          const assetProgress = initialBufferPercentage + 
            (assetLoadingPercentage * loadedCount / totalAssets);
          
          // Update progress (will only increase, never decrease)
          updateProgress(Math.round(assetProgress));
          
          // Check if all assets are loaded
          if (loadedCount === totalAssets) {
            console.log('All textures loaded successfully');
            
            // Only complete if minimum time has passed
            if (hasReachedMinLoadingTime()) {
              completeLoading();
            } else {
              // Otherwise wait until minimum time has passed
              const remainingTime = minLoadingTime - (Date.now() - startTime);
              setTimeout(completeLoading, remainingTime);
            }
          }
        },
        // Progress callback - unused by TextureLoader but required by the signature
        undefined,
        (error) => {
          console.error(`Error loading asset ${asset.id}:`, error);
          loadedCount++;
          loadedAssets[asset.id] = false;
          
          // Even on error, update progress
          const assetProgress = initialBufferPercentage + 
            (assetLoadingPercentage * loadedCount / totalAssets);
          
          // Update progress (will only increase, never decrease)
          updateProgress(Math.round(assetProgress));
          
          // Continue if all assets are attempted
          if (loadedCount === totalAssets) {
            console.log('All texture loading attempts completed (with errors)');
            
            // Only complete if minimum time has passed
            if (hasReachedMinLoadingTime()) {
              completeLoading();
            } else {
              // Otherwise wait until minimum time has passed
              const remainingTime = minLoadingTime - (Date.now() - startTime);
              setTimeout(completeLoading, remainingTime);
            }
          }
        }
      );
    });

    // In case there are no assets to preload
    if (totalAssets === 0) {
      console.log('No textures to preload, simulating loading for better UX');
      
      // Simulate loading for better UX
      setTimeout(() => {
        completeLoading();
      }, minLoadingTime);
    }

    return () => {
      // Cleanup
      clearTimeout(forceCompleteTimeout);
      clearSteadyProgress();
      console.log('AssetPreloader unmounting');
    };
  }, [onProgress, onComplete]);

  return null; // This component doesn't render anything
};

// Pre-Rendering of 3D components to ensure their availability
const HiddenComponents = () => {
  return (
    <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5] }} style={{ width: 1, height: 1 }}>
        <CelestialObject position={[0, 0, 0]} size={1} color="#ffffff" />
        <Mars position={[0, 0, 0]} size={1} />
        <Moon />
        <SkySphere />
        <SpacePortal position={[0, 0, 0]} size={1} ringCount={2} />
        <WormHole position={[0, 0, 0]} size={1} />
      </Canvas>
    </div>
  );
};

const InteractiveStars = () => {
  const starsRef = useRef<THREE.Points>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { isMobile } = useWindowSize()

  const handleMouseMove = useCallback((x: number, y: number) => {
    if (!isMobile) {
      setMousePosition({ x, y })
    }
  }, [isMobile])

  useThrottledMouseMove(handleMouseMove, 16)

  // Throttle useFrame updates for better performance
  let lastUpdate = 0
  useFrame(() => {
    if (!starsRef.current || isMobile) return
    
    // Only update every 2 frames (30fps instead of 60fps)
    const now = performance.now()
    if (now - lastUpdate < 33) return // ~30fps
    lastUpdate = now

    // Reduced animation intensity
    const intensity = 0.00003 // Further reduced
    starsRef.current.rotation.x += (mousePosition.y * intensity - starsRef.current.rotation.x) * 0.08
    starsRef.current.rotation.y += (mousePosition.x * intensity - starsRef.current.rotation.y) * 0.08
  })

  return (
    <group>
      <Stars
        ref={starsRef}
        radius={100}
        depth={50}
        count={isMobile ? 1000 : 2000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </group>
  )
}

const FloatingText = () => {
  const { reduceAnimations } = usePerformanceMode()
  const { isMobile } = useWindowSize()
  
  // Disable complex animations on low-end devices
  if (reduceAnimations || isMobile) return null

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold pointer-events-none"
      animate={{
        y: [0, -10, 0], // Reduced movement
        opacity: [0.5, 0.8, 0.5], // Reduced opacity change
      }}
      transition={{
        duration: 4, // Slower, less frequent updates
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={{
        textShadow: '0 0 10px rgba(255,255,255,0.5)',
      }}
    >
    </motion.div>
  )
}

const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null)
  const { isMobile } = useWindowSize()
  
  // Create particles using useMemo
  const particleSystem = useMemo(() => {
    const count = isMobile ? 500 : 1000
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: "#ffffff",
      transparent: true,
      opacity: 0.6
    })
    
    return new THREE.Points(geometry, material)
  }, [isMobile])

  useEffect(() => {
    // Store reference to the particle system
    particlesRef.current = particleSystem
    
    return () => {
      // Clean up
      particleSystem.geometry.dispose()
      if (particleSystem.material instanceof THREE.Material) {
        particleSystem.material.dispose()
      }
    }
  }, [particleSystem])

  useFrame((state) => {
    if (particleSystem) {
      particleSystem.rotation.y += isMobile ? 0.0005 : 0.001
    }
  })

  return (
    <primitive object={particleSystem} />
  )
}

const TouchHint = () => {
  const [show, setShow] = useState(true)
  const { isMobile } = useWindowSize()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 5000) // Hide after 5 seconds

    return () => clearTimeout(timer)
  }, [])

  // On mobile, use the ScrollDownButton instead
  if (isMobile || !show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-lg">Move mouse to interact</span>
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-6 h-10 border-2 border-white rounded-full p-2"
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const ScrollDownButton = () => {
  const { isMobile } = useWindowSize()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  // Define the order of sections
  const sectionOrder = ['hero', 'about', 'experience', 'skills', 'projects', 'contact']

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return

      // Get all section elements
      const sections = sectionOrder
        .map(id => document.getElementById(id))
        .filter(Boolean) as HTMLElement[]

      // Get current scroll position with buffer for better detection
      const scrollPosition = window.scrollY + window.innerHeight * 0.2

      // Find which section we're currently in
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const nextSection = sections[i + 1]
        
        const sectionTop = section.offsetTop
        const sectionBottom = sectionTop + section.offsetHeight
        
        // Check if we're in this section
        // If this is the last section or we're between this section's top and the next section's top
        if (
          (nextSection && scrollPosition >= sectionTop && scrollPosition < nextSection.offsetTop) ||
          (!nextSection && scrollPosition >= sectionTop)
        ) {
          if (currentSectionIndex !== i) {
            setCurrentSectionIndex(i)
          }
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isScrolling, currentSectionIndex])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      setIsScrolling(true)
      
      // Calculate the exact position to scroll to
      // We want to align the top of the section with the top of the viewport
      // but we need to account for the navbar height
      const navbarHeight = 64 // Approximate height of navbar in pixels
      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const targetScrollPosition = sectionTop - navbarHeight
      
      // Use smooth scrolling for better UX
      window.scrollTo({
        top: targetScrollPosition,
        behavior: 'smooth'
      })
      
      // Reset scrolling state after animation completes
      setTimeout(() => {
        setIsScrolling(false)
      }, 1000) // Adjust timing based on your scroll animation duration
    }
  }

  const handleScrollDown = () => {
    if (isScrolling) return

    const nextIndex = currentSectionIndex + 1
    if (nextIndex >= sectionOrder.length) {
      scrollToSection('hero')
      setCurrentSectionIndex(0)
    } else {
      scrollToSection(sectionOrder[nextIndex])
      setCurrentSectionIndex(nextIndex)
    }
  }

  const handleScrollToTop = () => {
    if (isScrolling) return
    scrollToSection('hero')
    setCurrentSectionIndex(0)
  }

  // Only render on mobile devices
  if (!isMobile) return null

  const isLastSection = currentSectionIndex === sectionOrder.length - 1

  return (
    <motion.button
      onClick={isLastSection ? handleScrollToTop : handleScrollDown}
      onTouchEnd={isLastSection ? handleScrollToTop : handleScrollDown}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        y: [0, 10, 0] 
      }}
      transition={{
        opacity: { delay: 1, duration: 0.5 },
        y: { 
          delay: 1.5,
          duration: 1.5, 
          repeat: Infinity,
          repeatType: "reverse"
        }
      }}
      className="fixed bottom-11 right-4 z-50 text-white flex flex-col items-center cursor-pointer"
      aria-label={isLastSection ? "Scroll to top" : "Scroll down"}
      style={{
        WebkitTapHighlightColor: 'transparent',
        position: 'fixed'
      }}
      disabled={isScrolling}
    >
      <motion.div
        animate={{
          y: [0, 5, 0]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
        style={{ position: 'relative' }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="drop-shadow-glow"
          style={{
            transform: isLastSection ? 'rotate(180deg)' : 'none'
          }}
        >
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </motion.div>
    </motion.button>
  )
}

const ParticleTrail = () => {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; opacity: number }>>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticle = {
          x: mousePosition.x,
          y: mousePosition.y,
          size: Math.random() * 4 + 2,
          opacity: 1
        }
        return [...prev.slice(-20), newParticle]
      })
    }, 50)

    return () => clearInterval(interval)
  }, [mousePosition])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute bg-white rounded-full"
          initial={{ 
            x: particle.x, 
            y: particle.y,
            scale: 1,
            opacity: particle.opacity
          }}
          animate={{ 
            x: particle.x + (Math.random() - 0.5) * 100,
            y: particle.y + (Math.random() - 0.5) * 100,
            scale: 0,
            opacity: 0
          }}
          transition={{
            duration: 1,
            ease: "easeOut"
          }}
          style={{
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </div>
  )
}

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [loadingComplete, setLoadingComplete] = useState(false)
  const { isMobile } = useWindowSize()
  const [loadingPhase, setLoadingPhase] = useState('INITIALIZING')

  // Skip loading screen if assets are already loaded
  useEffect(() => {
    if (assetsAlreadyLoaded) {
      console.log('Assets already loaded, skipping loading screen');
      handleComplete();
    }
  }, []);

  // Update loading phase based on progress
  useEffect(() => {
    if (progress < 20) {
      setLoadingPhase('INITIALIZING');
    } else if (progress < 40) {
      setLoadingPhase('LOADING ASSETS');
    } else if (progress < 60) {
      setLoadingPhase('RENDERING');
    } else if (progress < 80) {
      setLoadingPhase('OPTIMIZING');
    } else if (progress < 100) {
      setLoadingPhase('FINALIZING');
    } else {
      setLoadingPhase('READY');
    }
  }, [progress]);

  const handleProgress = (newProgress: number) => {
    // Ensure progress only moves forward, never backward
    setProgress(current => {
      // Only update if the new value is higher than current
      if (newProgress > current) {
        // For small changes, just set the exact value
        if (newProgress - current < 3) {
          return newProgress;
        }
        
        // For larger jumps, smooth the transition (max 2% increase per frame)
        return current + Math.min(2, (newProgress - current) * 0.1);
      }
      
      // Keep current value if newProgress is lower
      return current;
    });
  };

  const handleComplete = () => {
    // Make sure we show 100% at the end
    setProgress(100);
    setLoadingPhase('READY');
    console.log('Asset loading complete, preparing to dismiss loading screen');
    
    // Add a slight delay before setting loading complete
    setTimeout(() => {
      setLoadingComplete(true);
      console.log('Setting loadingComplete to true');
      
      // Call the parent's onLoadingComplete after a short delay
      setTimeout(() => {
        console.log('Calling onLoadingComplete callback');
        onLoadingComplete();
      }, 300);
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-black z-50"
      style={{ position: 'fixed' }}
    >
      {/* Load assets during the loading screen */}
      <AssetPreloader onProgress={handleProgress} onComplete={handleComplete} />
      
      {/* Pre-render 3D components */}
      <HiddenComponents />
      
      <div className="text-center">
        <motion.div
          className="relative w-64 h-64 mx-auto mb-8"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-lg" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white text-xl font-medium mb-4"
        >
          {loadingComplete ? 'Ready!' : 'Loading Portfolio'}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-400 text-sm mt-4"
        >
          <div className="flex flex-col items-center space-y-2">
            <motion.div 
              animate={{ 
                color: loadingComplete ? '#a8ff9c' : '#ffffff'
              }}
              transition={{ duration: 0.3 }}
              className="text-lg font-medium"
            >
              {Math.round(progress)}%
            </motion.div>
            
            <motion.div className="w-28 flex justify-between items-center mt-1">
              {[0, 1, 2, 3, 4].map((step) => {
                const isActive = progress >= (step + 1) * 20;
                const isCurrentStep = progress >= step * 20 && progress < (step + 1) * 20;
                
                return (
                  <motion.div
                    key={step}
                    className="w-1.5 h-1.5 rounded-full"
                    animate={{
                      scale: isCurrentStep ? [1, 1.5, 1] : 1,
                      backgroundColor: isActive 
                        ? 'rgba(147, 51, 234, 0.9)' 
                        : isCurrentStep 
                          ? 'rgba(147, 51, 234, 0.5)' 
                          : 'rgba(255, 255, 255, 0.3)',
                    }}
                    transition={{
                      scale: {
                        repeat: Infinity,
                        duration: 1.5
                      },
                      backgroundColor: { duration: 0.3 }
                    }}
                  />
                );
              })}
            </motion.div>
            
            <motion.div
              animate={{ 
                opacity: loadingComplete ? 0 : 1
              }}
              className="text-xs tracking-wider uppercase opacity-75 mt-1"
            >
              {loadingPhase}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const GlowingOrb = () => {
  const { isMobile } = useWindowSize()

  return (
    <motion.div
      className="absolute w-64 h-64 rounded-full"
      style={{
        top: '20%',
        left: '20%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.05) 70%, rgba(0, 0, 0, 0) 100%)',
        filter: 'blur(40px)',
      }}
      animate={{
        scale: isMobile ? 1 : [1, 1.2, 1],
        opacity: isMobile ? 0.2 : [0.1, 0.3, 0.1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  )
}

const Hero = () => {
  const { t } = useLanguage()
  const [showContent, setShowContent] = useState(false)
  const [isLoading, setIsLoading] = useState(!assetsAlreadyLoaded) // Skip loading if assets already loaded
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { isMobile } = useWindowSize()
  const [loadedAssets, setLoadedAssets] = useState<{ [key: string]: boolean }>({})
  const [preloadProgress, setPreloadProgress] = useState(0)

  // Create scene lights - memoized
  const ambientLight = useMemo(() => new THREE.AmbientLight(0xffffff, 0.5), []);
  const pointLight = useMemo(() => {
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    return light;
  }, []);

  // Inject global styles
  useEffect(() => {
    // Inject the global styles
    const styleElement = document.createElement('style')
    styleElement.innerHTML = globalStyles
    document.head.appendChild(styleElement)
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  const handleLoadingComplete = useCallback(() => {
    // Remove the class when loading is done
    console.log('Hero component: Handling loading complete');
    document.body.classList.remove('loading-active');
    setIsLoading(false);
    
    // Short delay before showing content
    setTimeout(() => {
      console.log('Hero component: Setting showContent to true');
      setShowContent(true);
    }, 300);
  }, []);

  // Show content immediately if assets are already loaded
  useEffect(() => {
    if (assetsAlreadyLoaded && !showContent) {
      setIsLoading(false);
      setShowContent(true);
    }
  }, [showContent]);

  const handleMouseMove = useCallback((x: number, y: number) => {
    if (!isMobile) {
      setMousePosition({ x, y })
    }
  }, [isMobile])

  useThrottledMouseMove(handleMouseMove, 16)

  useEffect(() => {
    // Add a class to the body during loading
    document.body.classList.add('loading-active');
    
    return () => {
      document.body.classList.remove('loading-active');
    }
  }, [])

  return (
    <PreloadContext.Provider value={{ loadedAssets, progress: preloadProgress }}>
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-black" style={{ position: 'relative' }}>
        {/* Loading Screen */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <LoadingScreen onLoadingComplete={handleLoadingComplete} />
          )}
        </AnimatePresence>

        {/* Background Canvas */}
        <div className="absolute inset-0" style={{ position: 'absolute' }}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            {/* Use higher-level drei components instead of the raw THREE.js objects */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            
            {/* Background sky */}
            <SkySphere />
            
            {/* Celestial objects */}
            <CelestialObject position={[0, 0, -60]} size={15} color="#8860d0" />
            <WormHole position={[-30, 15, -50]} size={8} />
            <SpacePortal position={[30, -12, -50]} size={6} ringCount={4} />
            <Mars position={[20, 5, -40]} size={2} />
            
            {/* Main objects */}
            <Moon />
            <InteractiveStars />
            {/* ParticleField removed - can cause pixel artifacts */}
            
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>

        {/* Music Player */}
        <MusicPlayer />

        {/* For debugging texture loading */}
        {/* <TestTexture /> */}

        {/* Glowing Orbs */}
        <GlowingOrb />
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{
            bottom: '20%', 
            right: '20%',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.05) 70%, rgba(0, 0, 0, 0) 100%)',
            filter: 'blur(40px)',
          }}
          animate={{
            scale: isMobile ? 1 : [1, 1.2, 1],
            opacity: isMobile ? 0.2 : [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        {/* Particle Trail */}
        <ParticleTrail />

        {/* Floating Text */}
        <FloatingText />

        {/* Content */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
              }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.6, // Faster, simpler
                ease: "easeOut",
              }}
              className="relative z-10 text-center"
              style={{
                perspective: isMobile ? 'none' : '1000px',
                position: 'relative'
              }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                style={{
                  textShadow: '0 0 20px rgba(59,130,246,0.5)',
                }}
              >
                Ahmad Mehrabi
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-300 mb-8"
                style={{
                  textShadow: '0 0 10px rgba(255,255,255,0.3)',
                }}
              >
                {t('hero.role')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex justify-center gap-4"
              >
                <motion.a
                  whileHover={!isMobile ? { scale: 1.03 } : {}}
                  whileTap={{ scale: 0.98 }}
                  href="#contact"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group"
                >
                  <span className="relative z-10">{t('nav.contactMe')}</span>
                  {/* Simplified - use CSS instead of motion for hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* UI hints - show different components based on device type */}
        <TouchHint />
        <ScrollDownButton />
      </section>
    </PreloadContext.Provider>
  )
}

export default memo(Hero) 
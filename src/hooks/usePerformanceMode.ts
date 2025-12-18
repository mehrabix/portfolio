import { useState, useEffect } from 'react';

interface PerformanceMode {
  isLowEnd: boolean;
  reduceAnimations: boolean;
  reduce3D: boolean;
}

/**
 * Detects device performance capabilities and returns optimization flags
 */
export const usePerformanceMode = (): PerformanceMode => {
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>({
    isLowEnd: false,
    reduceAnimations: false,
    reduce3D: false,
  });

  useEffect(() => {
    // Check for low-end device indicators
    const checkPerformance = () => {
      const isMobile = window.innerWidth < 768;
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const deviceMemory = (navigator as any).deviceMemory || 4;
      
      // Consider low-end if:
      // - Mobile device
      // - Low CPU cores (< 4)
      // - Low memory (< 4GB)
      const isLowEnd = isMobile || hardwareConcurrency < 4 || deviceMemory < 4;
      
      setPerformanceMode({
        isLowEnd,
        reduceAnimations: isLowEnd || hardwareConcurrency < 6,
        reduce3D: isLowEnd || deviceMemory < 4,
      });
    };

    checkPerformance();
    
    // Recheck on resize
    const handleResize = () => checkPerformance();
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return performanceMode;
};


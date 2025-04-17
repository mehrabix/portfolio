import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import '../styles/customAnimations.css';

interface FloatingBadgeProps {
  text: string;
  icon?: React.ReactNode;
  className?: string;
  glowColor?: string;
}

const FloatingBadge: React.FC<FloatingBadgeProps> = ({ 
  text, 
  icon, 
  className = '',
  glowColor = 'rgba(59, 130, 246, 0.6)' // Default blue color
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for smoother animation
  const springConfig = { damping: 50, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-200, 200], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-200, 200], [-15, 15]), springConfig);
  
  // Position values for parallax effect on inner elements
  const contentX = useSpring(useTransform(x, [-200, 200], [10, -10]), springConfig);
  const contentY = useSpring(useTransform(y, [-200, 200], [10, -10]), springConfig);
  
  // Lighting/shadow effect based on mouse position
  const shadowX = useTransform(x, [-200, 200], [-20, 20]);
  const shadowY = useTransform(y, [-200, 200], [-20, 20]);
  const shadowOpacity = useTransform(
    x, 
    [-200, 0, 200], 
    [0.3, 0.2, 0.3]
  );

  // Glow effect that follows mouse position
  const glowX = useTransform(x, [-200, 200], [-50, 50]);
  const glowY = useTransform(y, [-200, 200], [-50, 50]);
  const glowOpacity = useTransform(
    x, 
    [-200, 0, 200], 
    [0.3, 0.4, 0.3]
  );
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    x.set(mouseX);
    y.set(mouseY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Random float animation delay for more organic movement
  const floatDelay = Math.random() * 2;
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      style={{
        perspective: 1000
      }}
    >
      {/* The 3D rotating card element */}
      <motion.div
        className="bg-black/20 backdrop-blur-xl p-4 sm:p-5 rounded-2xl overflow-hidden relative flex items-center gap-3 animate-float"
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          boxShadow: isMobile 
            ? `0 15px 35px rgba(0,0,0,0.2), 0 0 15px ${glowColor}` 
            : `${shadowX.get()}px ${shadowY.get()}px 30px rgba(0,0,0,${shadowOpacity.get()}), 0 0 15px ${glowColor}`,
          animationDelay: `-${floatDelay}s`
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-xl"
          style={{
            background: `radial-gradient(circle at ${glowX.get() + 50}% ${glowY.get() + 50}%, ${glowColor}, transparent 70%)`,
            opacity: glowOpacity,
            zIndex: -1
          }}
        />
        
        {/* Border gradient */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-300 animate-gradient-flow"
          style={{
            background: `linear-gradient(45deg, ${glowColor}, transparent 60%, ${glowColor})`,
            backgroundSize: '200% 200%',
            zIndex: -1
          }}
        />
        
        {/* Content with parallax effect */}
        <motion.div
          className="relative z-10 flex items-center gap-3"
          style={{
            translateX: isMobile ? 0 : contentX,
            translateY: isMobile ? 0 : contentY,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(20px)'
          }}
        >
          {icon && (
            <div className="text-2xl text-blue-400">
              {icon}
            </div>
          )}
          
          <div className="text-blue-100 font-medium text-sm sm:text-base">
            {text}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FloatingBadge; 
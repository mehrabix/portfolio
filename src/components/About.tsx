import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationControls } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import profileImage from '../assets/ahmadmehrabi.webp'

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const imageControls = useAnimationControls()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  
  // Enhanced spring animations
  const springConfig = { damping: 10, stiffness: 100 }
  const springY = useSpring(y, springConfig)
  const springOpacity = useSpring(opacity, springConfig)
  const springScale = useSpring(scale, springConfig)

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/mehrabix', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/mehrabix', label: 'LinkedIn' }
  ]

  // Handle image hover animation
  const handleImageHover = (isEntering: boolean) => {
    setIsHovered(isEntering)
    if (isEntering) {
      imageControls.start({
        scale: 1.05,
        transition: { duration: 0.5 }
      })
    } else {
      imageControls.start({
        scale: 1,
        transition: { duration: 0.5 }
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const relativeY = e.clientY - rect.top
    const percentX = Math.min(Math.max((relativeX / rect.width) * 100, 0), 100)
    const percentY = Math.min(Math.max((relativeY / rect.height) * 100, 0), 100)
    
    setMousePosition({
      x: percentX,
      y: percentY
    })
  }

  return (
    <section 
      id="about" 
      className="section-padding relative overflow-hidden py-24"
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced deep space background with animated noise texture */}
      <div className="absolute inset-0 bg-black animate-subtle-pulse"></div>
      
      {/* Advanced animated star field with varying star layers */}
      <div className="absolute inset-0">
        {/* Static stars */}
        <div className="absolute inset-0 opacity-90" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0), 
                          radial-gradient(circle at 3px 3px, rgba(136, 96, 208, 0.15) 1px, transparent 0),
                          radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.1) 1px, transparent 0)`,
          backgroundSize: '30px 30px, 50px 50px, 40px 40px'
        }} />
        
        {/* Animated small stars */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.1) 0%, transparent 30%)`,
          filter: 'blur(20px)',
          transition: 'background 0.3s ease'
        }} />
      </div>

      {/* Enhanced cosmic glow effects with reactivity to mouse position */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl animate-slow-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl animate-slow-pulse-delay"></div>
      <div className="absolute top-2/3 right-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/5 to-pink-500/5 blur-3xl animate-float"></div>
      
      {/* Dynamic glow that follows mouse */}
      <div 
        className="absolute w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, transparent 70%)`,
          left: `calc(${mousePosition.x}% - 20vw)`,
          top: `calc(${mousePosition.y}% - 20vw)`,
          filter: 'blur(50px)',
          transition: 'left 0.3s ease, top 0.3s ease'
        }}
      />

      {/* Container with cosmic parallax effect */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={containerRef}
          style={{ y: springY, opacity: springOpacity, scale: springScale }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400" 
              style={{
                textShadow: '0 0 30px rgba(59,130,246,0.4)'
              }}
              initial={{ letterSpacing: "0px" }}
              whileInView={{ letterSpacing: "1px" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              About Me
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              style={{ boxShadow: '0 0 15px rgba(59,130,246,0.6)' }}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Enhanced Profile Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              <div 
                className="relative aspect-square rounded-2xl overflow-hidden group"
                onMouseEnter={() => handleImageHover(true)}
                onMouseLeave={() => handleImageHover(false)}
              >
                {/* Advanced dynamic background gradient */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-black via-blue-900/10 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    backgroundSize: '400% 400%',
                    animation: 'gradientShift 8s ease infinite'
                  }}
                />
                
                {/* Enhanced animated border gradient */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{
                    background: `linear-gradient(${45 + mousePosition.x / 5}deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3), rgba(6,182,212,0.3))`,
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 6s linear infinite',
                    boxShadow: '0 0 20px rgba(29,78,216,0.3)'
                  }} 
                />

                {/* Dark hover overlay with enhanced interaction */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]"
                />

                {/* Floating particles effect - advanced version */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      initial={{ 
                        x: Math.random() * 100 + '%', 
                        y: Math.random() * 100 + '%',
                        backgroundColor: i % 3 === 0 ? 'rgba(59,130,246,0.6)' : 
                                       i % 3 === 1 ? 'rgba(139,92,246,0.6)' : 'rgba(6,182,212,0.6)',
                        width: Math.random() * 3 + 1 + 'px',
                        height: Math.random() * 3 + 1 + 'px',
                      }}
                      animate={{
                        x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                        y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                        opacity: [0.3, 0.7, 0.3],
                        scale: [0.8, 1.5, 0.8],
                      }}
                      transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{ 
                        boxShadow: '0 0 3px rgba(255,255,255,0.8)',
                        filter: 'blur(0.5px)'
                      }}
                    />
                  ))}
                </div>

                {/* Enhanced animated corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400/60 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-12 group-hover:h-12" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400/60 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-12 group-hover:h-12" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400/60 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-12 group-hover:h-12" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400/60 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-12 group-hover:h-12" />

                {/* Image with animation control */}
                <motion.div
                  animate={imageControls}
                  className="w-full h-full relative z-10"
                >
                  <img
                    src={profileImage}
                    alt="Ahmad Mehrabi"
                    className="w-full h-full object-cover relative z-10"
                    style={{ filter: isHovered ? 'brightness(1.1)' : 'brightness(1)' }}
                  />
                </motion.div>
              </div>

              {/* Enhanced Social Links */}
              <div className="flex justify-center gap-6 mt-8">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 360,
                      boxShadow: '0 0 20px rgba(59,130,246,0.7)'
                    }}
                    className="relative group p-3 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-lg"
                  >
                    {/* Enhanced glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                         style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
                    />
                    
                    {/* Icon with enhanced glow */}
                    <social.icon 
                      className="text-3xl text-white relative z-10 transition-all duration-300 group-hover:text-blue-300" 
                      style={{ 
                        filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.8))'
                      }}
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-6"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-white/90 leading-relaxed font-light"
                style={{ 
                  textShadow: '0 0 2px rgba(255,255,255,0.3)',
                  backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,1), rgba(255,255,255,0.9))',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}
              >
                I'm a passionate Full Stack Developer with expertise in modern web technologies.
                With a strong foundation in both frontend and backend development, I create
                scalable and performant applications that deliver exceptional user experiences.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-white/90 leading-relaxed font-light"
                style={{ 
                  textShadow: '0 0 2px rgba(255,255,255,0.3)',
                  backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,1), rgba(255,255,255,0.9))',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 3s ease-in-out 1s infinite'
                }}
              >
                My journey in software development has been driven by a constant desire to learn
                and innovate. I specialize in building micro-frontend architectures, implementing
                robust state management solutions, and optimizing application performance.
              </motion.p>

              <div className="flex flex-wrap gap-4 mt-8">
                {['Frontend Development', 'Backend Development', 'DevOps'].map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: 'rgba(59,130,246,0.3)',
                      boxShadow: '0 0 25px rgba(59,130,246,0.5)' 
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md text-white/90 rounded-full text-sm transition-all duration-500 relative group"
                    style={{ boxShadow: '0 0 15px rgba(59,130,246,0.2)' }}
                  >
                    {/* Enhanced inner glow */}
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ 
                            animation: 'shimmerGlow 2s ease-in-out infinite',
                            filter: 'blur(3px)'
                          }}
                    />
                    
                    <span className="relative z-10">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        @keyframes shimmerGlow {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        
        .animate-subtle-pulse {
          animation: subtle-pulse 3s ease-in-out infinite;
        }
        
        .animate-slow-pulse {
          animation: pulseGlow 8s ease-in-out infinite;
        }
        
        .animate-slow-pulse-delay {
          animation: pulseGlow 8s ease-in-out 2s infinite;
        }
        
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(10px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(-10px) translateX(10px); }
        }
      `}</style>
    </section>
  )
}

export default About 
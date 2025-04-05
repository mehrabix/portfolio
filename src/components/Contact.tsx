import { motion, useScroll, useTransform, useSpring, useAnimationControls } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa'

// Enhanced particle animation for contact section
const ContactParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.2,
            backgroundColor: i % 5 === 0 ? 'rgba(59,130,246,0.6)' : 
                          i % 5 === 1 ? 'rgba(139,92,246,0.6)' : 
                          i % 5 === 2 ? 'rgba(6,182,212,0.6)' : 
                          i % 5 === 3 ? 'rgba(124,58,237,0.6)' : 'rgba(219,39,119,0.6)',
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
          }}
          animate={{
            x: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`
            ],
            y: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`
            ],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            filter: 'blur(1px)',
            boxShadow: '0 0 4px currentColor'
          }}
        />
      ))}
    </div>
  )
}

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
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

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      text: 'mehrabi@post.com',
      link: 'mailto:mehrabi@post.com',
      animation: "email"
    },
    {
      icon: FaPhone,
      title: 'Phone',
      text: '+989211857452',
      link: 'tel:+989211857452',
      animation: "phone"
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      text: 'Isfahan, Iran',
      link: '#',
      animation: "location"
    }
  ]

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/mehrabix', label: 'GitHub', color: '#4078c0' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/mehrabix', label: 'LinkedIn', color: '#0077b5' }
  ]

  // Animation variants for contact cards
  const cardVariants = {
    initial: { 
      scale: 0.95, 
      opacity: 0, 
      y: 20,
      boxShadow: '0 0 0 rgba(59,130,246,0)'
    },
    animate: (i: number) => ({ 
      scale: 1, 
      opacity: 1, 
      y: 0,
      boxShadow: '0 0 20px rgba(59,130,246,0.2)',
      transition: {
        type: "spring",
        duration: 0.8,
        delay: i * 0.15,
        ease: "easeOut"
      }
    }),
    hover: { 
      scale: 1.03,
      boxShadow: '0 0 30px rgba(59,130,246,0.4)',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  }

  return (
    <section 
      id="contact" 
      className="section-padding py-24 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced deep space background with animated noise texture */}
      <div className="absolute inset-0 bg-black animate-subtle-pulse"></div>
      
      {/* Advanced animated star field with ContactParticles */}
      <ContactParticles />
      
      {/* Enhanced star field */}
      <div className="absolute inset-0 opacity-90">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0), 
                          radial-gradient(circle at 3px 3px, rgba(136, 96, 208, 0.15) 1px, transparent 0),
                          radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.1) 1px, transparent 0)`,
          backgroundSize: '30px 30px, 50px 50px, 40px 40px'
        }} />
      </div>

      {/* Enhanced cosmic glow effects with reactivity to mouse position */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl animate-slow-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl animate-slow-pulse-delay"></div>
      
      {/* Dynamic glow that follows mouse */}
      <div 
        className="absolute w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, transparent 70%)`,
          left: `calc(${mousePosition.x}% - 20vw)`,
          top: `calc(${mousePosition.y}% - 20vw)`,
          filter: 'blur(50px)',
          transition: 'left 0.5s ease, top 0.5s ease'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={containerRef}
          style={{ y: springY, opacity: springOpacity, scale: springScale }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
              initial={{ letterSpacing: "0px" }}
              whileInView={{ letterSpacing: "1px" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                textShadow: '0 0 30px rgba(59,130,246,0.4)'
              }}
            >
              Get In Touch
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              style={{ boxShadow: '0 0 15px rgba(59,130,246,0.6)' }}
            />
            <motion.p 
              className="max-w-2xl mx-auto mt-6 text-white/80 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ 
                textShadow: '0 0 2px rgba(255,255,255,0.3)',
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,1), rgba(255,255,255,0.9))',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s ease-in-out infinite'
              }}
            >
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Enhanced Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-6"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial="initial"
                  whileInView="animate"
                  whileHover="hover"
                  custom={index}
                  variants={cardVariants}
                  className="relative group"
                >
                  {/* Enhanced glowing background effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-90 group-hover:scale-110" 
                    style={{ 
                      filter: 'blur(20px)',
                      background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.2) 50%, transparent 100%)`
                    }}
                  />
                  
                  <a
                    href={info.link}
                    className="relative p-6 rounded-2xl border border-blue-500/30 bg-black/70 backdrop-blur-lg flex items-center gap-6 group-hover:border-blue-500/60 transition-all duration-500 overflow-hidden"
                  >
                    {/* Ambient glow when hovered */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59,130,246,0.15) 0%, transparent 60%)`,
                        filter: 'blur(20px)',
                      }}
                    />
                    
                    {/* Animated icon background */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
                      {/* Holographic effect on icon */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                        style={{ 
                          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)',
                          backgroundSize: '200% 200%',
                          animation: 'gradientShift 3s ease infinite',
                          filter: 'blur(8px)'
                        }}
                      />
                      
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: info.animation === "email" ? [0, 10, 0, -10, 0] : 
                                 info.animation === "phone" ? [0, 15, -15, 0] : 
                                 [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 3,
                          ease: "easeInOut",
                          times: info.animation === "email" ? [0, 0.2, 0.5, 0.8, 1] : 
                                info.animation === "phone" ? [0, 0.3, 0.7, 1] :
                                [0, 0.33, 0.66, 1],
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      >
                        <info.icon 
                          className="text-2xl relative z-10 text-transparent" 
                          style={{ 
                            filter: 'drop-shadow(0 0 5px rgba(59,130,246,0.8))',
                            backgroundImage: 'linear-gradient(90deg, #60a5fa, #c084fc, #60a5fa)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 3s linear infinite',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                          }} 
                        />
                      </motion.div>
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="text-xl font-semibold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">{info.title}</h3>
                      <p className="text-gray-300 group-hover:text-white transition-colors">{info.text}</p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative group h-full"
            >
              <motion.div 
                initial="initial"
                whileInView="animate"
                whileHover="hover"
                variants={cardVariants}
                custom={3}
                className="relative h-full"
              >
                {/* Enhanced glowing background effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-90 group-hover:scale-110" 
                  style={{ 
                    filter: 'blur(20px)',
                    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.2) 50%, transparent 100%)`
                  }}
                />
                
                <div className="relative p-8 rounded-2xl border border-blue-500/30 bg-black/70 backdrop-blur-lg h-full flex flex-col group-hover:border-blue-500/60 transition-all duration-500">
                  {/* Ambient glow when hovered */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59,130,246,0.15) 0%, transparent 60%)`,
                      filter: 'blur(20px)',
                    }}
                  />
                  
                  <motion.h3 
                    className="text-2xl font-semibold mb-8 relative z-10"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{ 
                      background: 'linear-gradient(to right, #fff, #b2ccff, #fff)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 3s ease-in-out infinite',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Connect With Me
                  </motion.h3>
                  
                  <div className="flex gap-6 flex-wrap justify-center items-center flex-1 relative z-10">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.2 }}
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: 360,
                          boxShadow: `0 0 30px ${social.color}80`
                        }}
                        className="p-4 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-full relative group/icon"
                      >
                        {/* Enhanced glow effect with custom colors */}
                        <div 
                          className="absolute inset-0 rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"
                          style={{ 
                            background: `radial-gradient(circle, ${social.color}50 0%, transparent 70%)`,
                            filter: 'blur(10px)',
                            animation: 'pulseGlow 2s ease-in-out infinite'
                          }}
                        />
                        
                        {/* Icon with enhanced glow */}
                        <social.icon 
                          className="text-3xl relative z-10" 
                          style={{ 
                            filter: `drop-shadow(0 0 8px ${social.color}80)`,
                            color: social.color
                          }}
                        />
                      </motion.a>
                    ))}
                    
                    {/* Send message CTA button */}
                    <motion.a
                      href="mailto:mehrabi@post.com"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 0 30px rgba(59,130,246,0.5)'
                      }}
                      className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-full flex items-center gap-2 relative overflow-hidden group/btn w-full justify-center"
                    >
                      {/* Animated background flow */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
                        style={{ 
                          background: 'linear-gradient(45deg, #3b82f680, #8b5cf680, #06b6d480)',
                          backgroundSize: '200% 200%',
                          animation: 'gradientShift 3s ease infinite'
                        }}
                      />
                      
                      <span className="font-medium text-white relative z-10">Send Message</span>
                      <motion.div
                        animate={{
                          x: [0, 5, 0],
                          y: [0, -3, 0]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      >
                        <FaPaperPlane className="text-white relative z-10" />
                      </motion.div>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* CSS Animation Keyframes */}
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
          
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.2); }
          }
          
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
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
        `}
      </style>
    </section>
  )
}

export default Contact 
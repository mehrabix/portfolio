import { motion, useMotionValue, useTransform, useSpring, useAnimationControls, MotionValue } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaCode, FaServer, FaTools, FaShieldAlt, FaUsers, FaCogs } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'

// Particle animation component
const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.5,
            backgroundColor: i % 5 === 0 ? 'rgba(59,130,246,0.6)' : 
                          i % 5 === 1 ? 'rgba(139,92,246,0.6)' : 
                          i % 5 === 2 ? 'rgba(6,182,212,0.6)' : 
                          i % 5 === 3 ? 'rgba(124,58,237,0.6)' : 'rgba(219,39,119,0.6)',
          }}
          animate={{
            x: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`
            ],
            y: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`
            ],
            opacity: [0.2, 0.7, 0.4, 0.7, 0.2],
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

// Enhanced glowing line divider
const GlowingDivider = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div 
      className="w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent my-4"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 1.2, delay: delay, ease: "easeOut" }}
      viewport={{ once: true }}
      style={{ filter: 'blur(0.5px)', boxShadow: '0 0 8px rgba(59,130,246,0.6)' }}
    />
  )
}

// Advanced 3D parallax card
const SkillCard = ({ title, skills, icon: Icon, index }: { title: string; skills: string[]; icon: any; index: number }) => {
  const [isMobile, setIsMobile] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const [isGlowing, setIsGlowing] = useState(false)
  const glowControls = useAnimationControls()
  
  // Trigger glow effect periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing(true)
      glowControls.start({
        opacity: [0, 0.8, 0],
        scale: [0.8, 1.2, 1],
        transition: { duration: 2 }
      }).then(() => {
        setIsGlowing(false)
      })
    }, Math.random() * 8000 + 8000) // Random interval between 8-16s
    
    return () => clearInterval(interval)
  }, [glowControls])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', checkMobile)
    checkMobile() // Initial check
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const rotateX = useTransform(y, [-100, 100], [15, -15])
  const rotateY = useTransform(x, [-100, 100], [-15, 15])
  const scale = useTransform(y, [-100, 100], [1, 1.05])
  const brightness = useTransform(y, [-100, 100], [0.9, 1.1])

  const springConfig = { damping: 5, stiffness: 300, mass: 0.5 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)
  const springScale = useSpring(scale, springConfig)
  const springBrightness = useSpring(brightness, springConfig)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
    
    // Calculate mouse position relative to the card
    const relativeX = event.clientX - rect.left
    const relativeY = event.clientY - rect.top
    
    // Calculate percentage position (0-100)
    const percentX = (relativeX / rect.width) * 100
    const percentY = (relativeY / rect.height) * 100
    
    setMousePosition({
      x: percentX,
      y: percentY
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setMousePosition({ x: 50, y: 50 })
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      viewport={{ once: true, margin: "-100px" }}
      style={{
        rotateX: isMobile ? 0 : springRotateX,
        rotateY: isMobile ? 0 : springRotateY,
        scale: isMobile ? 1 : springScale,
        filter: `brightness(${springBrightness.get()})`,
        transformStyle: isMobile ? "flat" : "preserve-3d",
        transform: isMobile ? "none" : "perspective(1000px)",
      }}
      className="group bg-black/70 backdrop-blur-lg p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/60 transition-all duration-500 h-full flex flex-col relative overflow-hidden shadow-xl"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
           style={{ animation: 'gradientShift 8s linear infinite' }}
      />
      
      {/* Holographic effect - prismatic edge */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ 
          background: 'linear-gradient(45deg, #ff00cc, #3333ff, #00ccff, #33cc33, #ffff00, #ff3399)',
          backgroundSize: '400% 400%',
          animation: 'prismaticShift 3s ease infinite',
          filter: 'blur(15px)',
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Dynamic shining gradient overlay that follows mouse */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59,130,246,0.2) 0%, transparent 60%)`,
          filter: 'blur(20px)',
        }}
      />
      
      {/* Enhanced 3D layer effect with hover animation */}
      <div 
        className="absolute inset-px rounded-xl z-10 transform"
        style={{
          background: 'rgba(13, 17, 23, 0.7)',
          backdropFilter: 'blur(4px)',
          transform: isHovered ? `translateZ(10px)` : 'none',
          transition: 'transform 0.3s ease-out',
        }}
      />
      
      {/* Animated border gradient */}
      <div 
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
        style={{
          backgroundSize: '200% 100%',
          animation: 'gradientShift 4s linear infinite',
        }} 
      />

      {/* Periodic glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-blue-400/10"
        initial={{ opacity: 0 }}
        animate={glowControls}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              backgroundColor: i % 3 === 0 ? 'rgba(59,130,246,0.4)' : 
                             i % 3 === 1 ? 'rgba(139,92,246,0.4)' : 'rgba(6,182,212,0.4)',
            }}
            animate={{
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              opacity: [0.2, 0.5, 0.2],
              scale: [0.8, 1.5, 0.8],
            }}
            transition={{
              duration: Math.random() * 5 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ 
              boxShadow: '0 0 3px currentColor',
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-20 transform" style={{ transform: isHovered ? 'translateZ(30px)' : 'none', transition: 'transform 0.3s ease-out' }}>
        <motion.div
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="relative"
        >
          {/* Enhanced icon glow effect */}
          <motion.div 
            className="absolute inset-0 bg-blue-400/70 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
              scale: isHovered ? [1, 1.3, 1] : 1,
              opacity: isHovered ? [0.3, 0.7, 0.3] : 0.3
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <Icon 
            className="text-3xl relative z-10 text-transparent" 
            style={{ 
              backgroundImage: 'linear-gradient(90deg, #60a5fa, #c084fc, #60a5fa)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s linear infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.8))'
            }} 
          />
        </motion.div>
        <motion.h3 
          className="text-xl font-semibold relative z-10"
          animate={{
            scale: isHovered ? 1.05 : 1,
            x: isHovered ? 5 : 0,
            textShadow: isHovered ? '0 0 8px rgba(59,130,246,0.6)' : '0 0 4px rgba(59,130,246,0.3)'
          }}
          transition={{ duration: 0.3 }}
          style={{ 
            background: 'linear-gradient(to right, #fff, #b2ccff, #fff)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {title}
        </motion.h3>
      </div>

      <div className="flex flex-wrap gap-2 flex-1 items-start relative z-20 transform" style={{ transform: isHovered ? 'translateZ(20px)' : 'none', transition: 'transform 0.3s ease-out' }}>
        {skills.map((skill, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.03 + (Math.random() * 0.05), 
              duration: 0.5, 
              type: "spring", 
              stiffness: 100 
            }}
            whileHover={{ 
              scale: 1.1,
              y: -5,
              backgroundColor: 'rgba(59,130,246,0.3)',
              boxShadow: '0 0 15px rgba(59,130,246,0.5)',
            }}
            className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-300 rounded-full text-sm transition-all duration-300 cursor-default min-w-fit relative group/skill"
          >
            {/* Dynamic skill tag shine effect that follows mouse */}
            <div 
              className="absolute inset-0 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300 rounded-full"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59,130,246,0.5) 0%, transparent 70%)`,
                filter: 'blur(5px)',
              }}
            />
            <span className="relative z-10">{skill}</span>
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const skillCategories = [
    {
      title: 'Frontend Development',
      skills: [
        'JavaScript',
        'TypeScript',
        'CSS',
        'SCSS',
        'TailwindCSS',
        'HTML',
        'React',
        'Next.js',
        'Angular',
        'Rx.js',
        'Svelte',
        'SvelteKit',
        'Lit',
        'Stencil.js',
        'Web Components',
        'Module Federation',
        'Vue.js',
        'jQuery',
        'Bootstrap',
        'Material UI',
      ],
      icon: FaCode,
    },
    {
      title: 'Frontend Architecture',
      skills: [
        'Micro Frontends',
        'Webpack',
        'Rollup',
        'Redux',
        'NgRx',
        'Storybook',
        'Build Optimization',
        'Performance Tuning',
        'Cross-browser Compatibility',
        'State Management',
        'Component Architecture',
        'Design Systems',
        'Responsive Design',
        'Progressive Web Apps',
      ],
      icon: FaCogs,
    },
    {
      title: 'Backend Development',
      skills: [
        'Node.js',
        'Express',
        'Nest.js',
        'Socket.io',
        'Java',
        'Spring Boot',
        'PL/SQL',
        'RESTful APIs',
        'Backend Integration',
        'API Design',
        'GraphQL',
        'MongoDB',
        'PostgreSQL',
        'Redis',
        'Microservices',
      ],
      icon: FaServer,
    },
    {
      title: 'DevOps & Tools',
      skills: [
        'Docker',
        'Docker Swarm',
        'Jenkins',
        'CI/CD',
        'GitLab CI',
        'AWS',
        'Azure',
        'Linux',
        'Shell Scripting',
        'GitHub Actions',
        'Monitoring',
        'Nginx',
        'PM2',
        'Prometheus',
        'Grafana',
      ],
      icon: FaTools,
    },
    {
      title: 'Team Leadership',
      skills: [
        'Technical Leadership',
        'Mentoring',
        'Agile Methodologies',
        'Scrum',
        'Code Reviews',
        'Git Workflows',
        'Project Management',
        'Team Coordination',
        'Stakeholder Management',
        'Requirements Gathering',
        'Estimation',
        'Process Improvement',
      ],
      icon: FaUsers,
    },
    {
      title: 'Security Practices',
      skills: [
        'OWASP Top 10',
        'Authentication',
        'Authorization',
        'JWT',
        'OAuth 2.0',
        'OpenID Connect',
        'CSRF Protection',
        'XSS Prevention',
        'Input Validation',
        'Security Headers',
        'Data Encryption',
        'Secure Coding Practices',
      ],
      icon: FaShieldAlt,
    },
  ]

  return (
    <section id="skills" className="section-padding py-20 relative overflow-hidden">
      {/* Enhanced deep space background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Advanced animated star field & particles */}
      <ParticleBackground />
      
      {/* Enhanced cosmic glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/5 to-cyan-500/5 blur-3xl"></div>
      <div className="absolute top-2/3 right-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-cyan-500/5 to-blue-500/5 blur-3xl"></div>
      
      {/* Dynamic nebula effect */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(76, 29, 149, 0.3) 0%, rgba(17, 24, 39, 0) 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
              initial={{ letterSpacing: "0px" }}
              whileInView={{ letterSpacing: "1px" }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
              style={{
                textShadow: '0 0 30px rgba(59,130,246,0.4)'
              }}
            >
              Skills & Expertise
            </motion.h2>
            
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              style={{ boxShadow: '0 0 15px rgba(59,130,246,0.6)' }}
            />
            
            <motion.p 
              className="max-w-2xl mx-auto mt-6 text-white/80 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              style={{ 
                textShadow: '0 0 2px rgba(255,255,255,0.3)',
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,1), rgba(255,255,255,0.9))',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s ease-in-out infinite'
              }}
            >
              With extensive experience across the full stack, I've developed a broad range of skills
              that enable me to tackle complex technical challenges and deliver exceptional solutions.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, index) => (
              <SkillCard
                key={index}
                title={category.title}
                skills={category.skills}
                icon={category.icon}
                index={index}
              />
            ))}
          </div>

          <GlowingDivider delay={0.8} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.p 
              className="max-w-2xl mx-auto text-white/80 text-lg"
              style={{ 
                textShadow: '0 0 2px rgba(255,255,255,0.3)',
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,1), rgba(255,255,255,0.9))',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s ease-in-out 0.5s infinite'
              }}
            >
              Constantly expanding my knowledge and staying up-to-date with the latest industry trends
              and technologies to deliver cutting-edge solutions.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Replace jsx style with style element */}
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
          
          @keyframes prismaticShift {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
          
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          
          @keyframes floatParticles {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(10px) translateX(10px); }
            50% { transform: translateY(0) translateX(15px); }
            75% { transform: translateY(-10px) translateX(5px); }
          }
        `}
      </style>
    </section>
  )
}

export default Skills
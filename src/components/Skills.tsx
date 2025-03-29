import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaCode, FaServer, FaTools, FaShieldAlt, FaUsers, FaCogs } from 'react-icons/fa'
import { useState, useEffect } from 'react'

const SkillCard = ({ title, skills, icon: Icon }: { title: string; skills: string[]; icon: any }) => {
  const [isMobile, setIsMobile] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

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

  const springConfig = { damping: 2, stiffness: 1000, mass: 0.1 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)
  const springScale = useSpring(scale, springConfig)

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
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isMobile ? 0 : springRotateX,
        rotateY: isMobile ? 0 : springRotateY,
        scale: isMobile ? 1 : springScale,
        transformStyle: isMobile ? "flat" : "preserve-3d",
        transform: isMobile ? "none" : "perspective(800px)",
      }}
      className="group bg-tertiary/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all duration-100 h-full flex flex-col relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Dynamic shining gradient overlay that follows mouse */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(var(--secondary-rgb), 0.2) 0%, transparent 50%)`,
          filter: 'blur(20px)',
        }}
      />
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
           style={{
             backgroundSize: '200% 100%',
             animation: 'shine 3s linear infinite',
           }} 
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-secondary/20 rounded-full"
            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
            animate={{
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6 relative">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Dynamic glow effect that follows mouse */}
          <div 
            className="absolute inset-0 bg-secondary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              transform: `translate(${(mousePosition.x - 50) * 0.2}%, ${(mousePosition.y - 50) * 0.2}%)`,
              filter: 'blur(15px)',
            }}
          />
          <Icon className="text-3xl text-secondary relative z-10" />
        </motion.div>
        <motion.h3 
          className="heading-3 text-secondary relative z-10"
          animate={{
            scale: isHovered ? 1.05 : 1,
            x: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
      </div>
      <div className="flex flex-wrap gap-2 flex-1 items-start relative z-10">
        {skills.map((skill, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(var(--secondary-rgb), 0.2)',
              boxShadow: '0 0 15px rgba(var(--secondary-rgb), 0.3)',
            }}
            className="inline-flex items-center px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm hover:bg-secondary/20 transition-all duration-300 cursor-default min-w-fit relative group/skill"
          >
            {/* Dynamic skill tag shine effect that follows mouse */}
            <div 
              className="absolute inset-0 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(var(--secondary-rgb), 0.3) 0%, transparent 50%)`,
                filter: 'blur(10px)',
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
      title: 'DevOps & Automation',
      skills: [
        'Linux',
        'Jenkins',
        'Nginx',
        'GitLab CI/CD',
        'Docker',
        'Shell Scripting',
        'YAML',
        'Kubernetes',
        'Ansible',
        'Automation Scripting',
        'Azure',
        'Logging',
      ],
      icon: FaTools,
    },
    {
      title: 'Testing & Quality',
      skills: [
        'OWASP TOP 10',
        'Cypress',
        'Playwright',
        'Jest',
        'Unit Testing',
        'E2E Testing',
        'Test Automation',
        'Code Review',
        'Quality Assurance',
        'Performance Testing',
        'Security Testing',
        'Testing Strategies',
        'Test-Driven Development',
        'Continuous Testing',
      ],
      icon: FaShieldAlt,
    },
    {
      title: 'Methodologies & Leadership',
      skills: [
        'Agile',
        'Scrum',
        'Team Leadership',
        'Cross-functional Teams',
        'CI/CD',
        'Project Management',
        'Technical Documentation',
        'Code Standards',
        'Code Review',
        'Mentoring',
        'Technical Architecture',
        'System Design',
        'Problem Solving',
        'Team Collaboration',
      ],
      icon: FaUsers,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
            >
              <SkillCard title={category.title} skills={category.skills} icon={category.icon} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
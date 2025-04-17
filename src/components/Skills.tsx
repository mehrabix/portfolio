import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  FaCode, FaServer, FaTools, FaShieldAlt, FaUsers, FaCogs, FaReact, FaAngular, FaVuejs, 
  FaNodeJs, FaJava, FaDocker, FaJenkins, FaGitlab, FaLinux, FaBootstrap, FaCss3Alt, FaHtml5, 
  FaJsSquare, FaPython, FaDatabase, FaLeaf, FaLayerGroup, FaRoute, FaCodeBranch, FaClipboardCheck, 
  FaTasks, FaUsersCog, FaLightbulb, FaWrench, FaProjectDiagram, FaSearch, FaBug, FaNetworkWired, 
  FaPuzzlePiece, FaLock, FaTachometerAlt, FaBook, FaComments, FaSync, FaCheckCircle, FaHourglassHalf,
  FaPaperPlane, FaPenFancy, FaFileCode, FaRulerCombined, FaQuestionCircle, FaUserShield, FaCubes, FaExchangeAlt,
  FaUniversalAccess, FaMobileAlt, FaSitemap, FaThList, FaObjectGroup, FaRegObjectUngroup, FaCloud
} from 'react-icons/fa'
import { 
  SiTypescript, SiTailwindcss, SiNextdotjs, SiSvelte, SiLit, SiWebpack, SiRollupdotjs, 
  SiRedux, SiNgrx, SiStorybook, SiExpress, SiNestjs, SiSocketdotio, SiSpringboot, SiPostgresql, 
  SiMongodb, SiRedis, SiKubernetes, SiAnsible, SiNginx, SiCypress, SiJest, SiYaml, SiJquery, 
  SiStencil, SiGraphql, SiTerraform, SiPrometheus, SiGrafana, SiGnubash
} from 'react-icons/si' // Import Simple Icons
import { TbBrandCSharp, TbApi, TbScript, TbTerminal2, TbTestPipe, TbBulb } from 'react-icons/tb' // Import Tabler Icons
import { GoMilestone } from 'react-icons/go'
import { LuComponent } from 'react-icons/lu'
import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

// Define the skill icon map
const skillIconMap: { [key: string]: React.ElementType } = {
  // Frontend Development
  'JavaScript': FaJsSquare,
  'TypeScript': SiTypescript,
  'CSS': FaCss3Alt,
  'SCSS': FaCss3Alt, // Using CSS icon for SCSS too
  'TailwindCSS': SiTailwindcss,
  'HTML': FaHtml5,
  'React': FaReact,
  'Next.js': SiNextdotjs,
  'Angular': FaAngular,
  'Rx.js': FaCodeBranch, // Generic icon for RxJS
  'Svelte': SiSvelte,
  'SvelteKit': SiSvelte, // Using Svelte icon
  'Lit': SiLit,
  'Stencil.js': SiStencil,
  'Web Components': LuComponent,
  'Module Federation': FaPuzzlePiece,
  'Vue.js': FaVuejs,
  'jQuery': SiJquery,
  'Bootstrap': FaBootstrap,
  'Material UI': LuComponent,

  // Frontend Architecture
  'Micro Frontends': FaObjectGroup,
  'Webpack': SiWebpack,
  'Rollup': SiRollupdotjs,
  'Redux': SiRedux,
  'NgRx': SiNgrx,
  'Storybook': SiStorybook,
  'Build Optimization': FaWrench,
  'Performance Tuning': FaTachometerAlt,
  'Cross-browser Compatibility': FaUniversalAccess,
  'State Management': FaLayerGroup,
  'Component Architecture': FaSitemap,
  'Design Systems': FaRulerCombined,
  'Responsive Design': FaMobileAlt,
  'Progressive Web Apps': FaMobileAlt, // Using mobile icon

  // Backend Development
  'Node.js': FaNodeJs,
  'Express': SiExpress,
  'Nest.js': SiNestjs,
  'Socket.io': SiSocketdotio,
  'Java': FaJava,
  'Spring Boot': SiSpringboot,
  'PL/SQL': FaDatabase, // Generic DB icon
  'RESTful APIs': TbApi,
  'Backend Integration': FaExchangeAlt,
  'API Design': FaPenFancy,
  'GraphQL': SiGraphql,
  'MongoDB': SiMongodb,
  'PostgreSQL': SiPostgresql,
  'Redis': SiRedis,
  'Microservices': FaCubes,

  // DevOps & Automation
  'Linux': FaLinux,
  'Jenkins': FaJenkins,
  'Nginx': SiNginx,
  'GitLab CI/CD': FaGitlab,
  'Docker': FaDocker,
  'Shell Scripting': SiGnubash,
  'YAML': SiYaml,
  'Kubernetes': SiKubernetes,
  'Ansible': SiAnsible,
  'Automation Scripting': TbScript,
  'Azure': FaCloud,
  'Logging': FaClipboardCheck,

  // Testing & Quality
  'OWASP TOP 10': FaUserShield,
  'Cypress': SiCypress,
  'Playwright': TbTestPipe,
  'Jest': SiJest,
  'Unit Testing': TbTestPipe,
  'E2E Testing': TbTestPipe, // Using same icon
  'Test Automation': FaWrench, // Using wrench icon
  'Code Review': FaSearch,
  'Quality Assurance': FaCheckCircle,
  'Performance Testing': FaTachometerAlt, // Using performance icon
  'Security Testing': FaLock,
  'Testing Strategies': FaRoute,
  'Test-Driven Development': FaCodeBranch, // Using branch icon
  'Continuous Testing': FaSync,

  // Methodologies & Leadership
  'Agile': FaSync, // Using sync icon
  'Scrum': FaTasks,
  'Team Leadership': FaUsersCog,
  'Cross-functional Teams': FaUsers,
  'CI/CD': FaPaperPlane,
  'Project Management': FaProjectDiagram,
  'Technical Documentation': FaBook,
  'Code Standards': FaFileCode,
  'Mentoring': FaLightbulb,
  'Technical Architecture': FaSitemap, // Using sitemap icon
  'System Design': FaCogs, // Using cogs icon
  'Problem Solving': TbBulb,
  'Team Collaboration': FaComments,

  // Default
  'default': FaCodeBranch, 
};

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
      className="group bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-100 h-full flex flex-col relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Dynamic shining gradient overlay that follows mouse */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59,130,246,0.15) 0%, transparent 50%)`,
          filter: 'blur(20px)',
        }}
      />
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
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
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
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
            className="absolute inset-0 bg-blue-400/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              transform: `translate(${(mousePosition.x - 50) * 0.2}%, ${(mousePosition.y - 50) * 0.2}%)`,
              filter: 'blur(15px)',
            }}
          />
          <Icon className="text-3xl text-blue-400 relative z-10" style={{ filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.6))' }} />
        </motion.div>
        <motion.h3 
          className="text-xl font-semibold text-white relative z-10"
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
        {skills.map((skill, index) => {
          const SkillIcon = skillIconMap[skill] || skillIconMap['default']; // Get icon or default
          return (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(59,130,246,0.2)',
                boxShadow: '0 0 15px rgba(59,130,246,0.3)',
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm hover:bg-blue-500/20 transition-all duration-300 cursor-default min-w-fit relative group/skill" // Added gap-1.5
            >
              {/* Dynamic skill tag shine effect that follows mouse */}
              <div 
                className="absolute inset-0 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59,130,246,0.3) 0%, transparent 50%)`,
                  filter: 'blur(10px)',
                }}
              />
              {/* Render Skill Icon */}
              <SkillIcon className="relative z-10 text-base" /> 
              <span className="relative z-10">{skill}</span>
            </motion.span>
          )
        })}
      </div>
    </motion.div>
  )
}

const Skills = () => {
  const { t } = useLanguage()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const skillGroups = [
    {
      title: t('skills.frontendDev'),
      icon: FaCode,
      skills: ["JavaScript", "TypeScript", "React", "Next.js", "Angular", "Vue.js", "SCSS", "TailwindCSS", "HTML", "CSS", "jQuery", "Bootstrap", "Material UI"]
    },
    {
      title: t('skills.frontendArch'),
      icon: FaSitemap,
      skills: ["Micro Frontends", "Module Federation", "Webpack", "Rollup", "Redux", "NgRx", "Performance Tuning", "Storybook", "Design Systems", "State Management", "Component Architecture"]
    },
    {
      title: t('skills.backendDev'),
      icon: FaServer,
      skills: ["Node.js", "Express", "Nest.js", "Socket.io", "Java", "Spring Boot", "PL/SQL", "RESTful APIs", "GraphQL", "PostgreSQL", "MongoDB", "Redis", "Microservices"]
    },
    {
      title: t('skills.devOps'),
      icon: FaTools,
      skills: ["Linux", "GitLab CI/CD", "Jenkins", "Docker", "Kubernetes", "Ansible", "Shell Scripting", "YAML", "Nginx", "Automation Scripting", "Azure"]
    },
    {
      title: t('skills.testing'),
      icon: FaShieldAlt,
      skills: ["Jest", "Cypress", "Playwright", "Unit Testing", "E2E Testing", "Test Automation", "Performance Testing", "Security Testing", "Code Review", "OWASP TOP 10"]
    },
    {
      title: t('skills.methodologies'),
      icon: FaUsers,
      skills: ["Agile", "Scrum", "Team Leadership", "Cross-functional Teams", "CI/CD", "Project Management", "Technical Documentation", "Mentoring", "Code Standards"]
    }
  ]

  return (
    <section id="skills" className="section-padding py-24 relative overflow-hidden" style={{ position: 'relative' }}>
      {/* Deep space background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Star field */}
      <div className="absolute inset-0 opacity-90">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0), 
                            radial-gradient(circle at 3px 3px, rgba(136, 96, 208, 0.15) 1px, transparent 0)`,
          backgroundSize: '30px 30px, 50px 50px'
        }} />
      </div>

      {/* Cosmic glow effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl"></div>

      <div className="container relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              style={{ textShadow: '0 0 30px rgba(59,130,246,0.4)' }}
            >
              {t('skills.title')}
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ boxShadow: '0 0 15px rgba(59,130,246,0.6)' }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillGroups.map((group, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <SkillCard title={group.title} skills={group.skills} icon={group.icon} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
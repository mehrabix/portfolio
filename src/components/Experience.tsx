import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa'
import { useState } from 'react'

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 }) // Start centered

  const experiences = [
    {
      title: 'Full Stack Software Engineer',
      company: 'Demis Holding',
      location: 'Isfahan, Iran',
      period: 'December 2021 - Present',
      website: 'https://demisco.com/en/',
      achievements: [
        'Orchestrated the transition from a monolithic architecture to micro-frontends, significantly improving scalability and reducing system downtime',
        'Devised automation solutions using GitLab CI, Jenkins, Ansible, and shell scripting, significantly boosting team productivity',
        'Led the frontend development team, improving delivery speed and enhancing team collaboration',
        'Optimized build processes utilizing Webpack, Rollup, and Module Federation, significantly reducing build times',
        'Implemented unit and end-to-end testing with Jest and Playwright, improving software quality and reducing defects',
      ],
    },
  ]

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    
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

  const handleMouseLeave = () => {
    setMousePosition({ x: 50, y: 50 }) // Center the effect when mouse leaves
  }

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
    <section id="experience" className="section-padding relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-primary" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container relative">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.h2
              className="heading-2 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary"
            >
              Work Experience
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>

          <div className="space-y-8 relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary/30 to-primary/30" />

            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group bg-tertiary/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300 relative overflow-hidden"
              >
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

                {/* Timeline dot with dynamic glow effect */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="absolute left-0 top-8 w-4 h-4 bg-secondary rounded-full transform -translate-x-1/2 shadow-lg shadow-secondary/50 relative z-10"
                >
                  <div 
                    className="absolute inset-0 bg-secondary/30 rounded-full animate-pulse"
                    style={{
                      transform: `translate(${(mousePosition.x - 50) * 0.1}%, ${(mousePosition.y - 50) * 0.1}%)`,
                      filter: 'blur(8px)',
                    }}
                  />
                </motion.div>

                <div className="ml-6 relative z-10">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
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
                      <FaBriefcase className="text-2xl text-secondary relative z-10" />
                    </motion.div>
                    <h3 className="heading-3 text-secondary">{exp.title}</h3>
                    <a
                      href={exp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-textSecondary hover:text-secondary transition-colors group/link"
                    >
                      @{exp.company}
                      <FaExternalLinkAlt className="text-xs opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-textSecondary mb-6">
                    <span className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-secondary" />
                      {exp.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-secondary" />
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {exp.achievements.map((achievement, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-textSecondary group/achievement"
                      >
                        <span className="text-secondary mt-1">•</span>
                        <span className="group-hover/achievement:text-secondary transition-colors duration-300">
                          {achievement}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Experience 
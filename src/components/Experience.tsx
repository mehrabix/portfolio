import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa'
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const Experience = () => {
  const { t } = useLanguage()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 }) // Start centered

  const experiences = [
    {
      title: t('experience.jobTitle'),
      company: t('experience.company'),
      location: t('experience.location'),
      period: t('experience.period'),
      website: 'https://demisco.com/en/',
      achievements: [
        t('experience.achievement1'),
        t('experience.achievement2'),
        t('experience.achievement3'),
        t('experience.achievement4'),
        t('experience.achievement5'),
        t('experience.achievement6'),
        t('experience.achievement7'),
        t('experience.achievement8'),
        t('experience.achievement9'),
        t('experience.achievement10'),
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
      <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl"></div>

      <div className="container relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              style={{ textShadow: '0 0 30px rgba(59,130,246,0.4)' }}
            >
              {t('experience.title')}
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ boxShadow: '0 0 15px rgba(59,130,246,0.6)' }}
            />
          </motion.div>

          <div className="space-y-8 relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/30 to-purple-500/30 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 relative overflow-hidden"
              >
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

                {/* Timeline dot with dynamic glow effect */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="absolute left-0 top-8 w-4 h-4 bg-blue-400 rounded-full transform -translate-x-1/2 shadow-lg shadow-blue-500/50 relative z-10"
                >
                  <div 
                    className="absolute inset-0 bg-blue-400/30 rounded-full animate-pulse"
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
                        className="absolute inset-0 bg-blue-400/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          transform: `translate(${(mousePosition.x - 50) * 0.2}%, ${(mousePosition.y - 50) * 0.2}%)`,
                          filter: 'blur(15px)',
                        }}
                      />
                      <FaBriefcase className="text-2xl text-blue-400 relative z-10" style={{ filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.6))' }} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                    <a
                      href={exp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors group/link"
                    >
                      @{exp.company}
                      <FaExternalLinkAlt className="text-xs opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                    <span className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-400" />
                      {exp.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-400" />
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
                        className="flex items-start gap-2 text-gray-300 group/achievement"
                      >
                        <span className="text-blue-400 mt-1">•</span>
                        <span className="group-hover/achievement:text-white transition-colors duration-300">
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
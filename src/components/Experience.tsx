import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa'

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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
                className="group bg-tertiary/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300 relative"
              >
                {/* Timeline dot */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="absolute left-0 top-8 w-4 h-4 bg-secondary rounded-full transform -translate-x-1/2 shadow-lg shadow-secondary/50"
                />

                <div className="ml-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FaBriefcase className="text-2xl text-secondary" />
                    </motion.div>
                    <h3 className="heading-3 text-secondary">{exp.title}</h3>
                    <a
                      href={exp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-textSecondary hover:text-secondary transition-colors group"
                    >
                      @{exp.company}
                      <FaExternalLinkAlt className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
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
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start gap-3 text-textSecondary p-3 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors duration-300"
                      >
                        <span className="text-secondary mt-1">•</span>
                        <span>{achievement}</span>
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
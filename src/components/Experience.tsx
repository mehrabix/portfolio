import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const experiences = [
    {
      title: 'Front End Software Engineer',
      company: 'Demis Holding',
      location: 'Isfahan, Iran',
      period: 'December 2021 - Present',
      website: 'https://demisco.com/en/',
      achievements: [
        'Orchestrated the transition from a monolithic architecture to micro-frontends, elevating scalability by 50% and reducing system downtime by 30%',
        'Devised automation solutions using GitLab CI, Jenkins, Ansible, and shell scripting, boosting team productivity by 60%',
        'Led a team of five frontend developers, expediting delivery speed by 30% and enhancing team collaboration by 25%',
        'Optimized build processes utilizing Webpack, Rollup, and Module Federation, cutting build times by 40%',
        'Implemented unit and end-to-end testing with Jest and Playwright, improving software quality and decreasing defects by 40%',
      ],
    },
  ]

  return (
    <section id="experience" className="section-padding">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="heading-2 text-center mb-12"
          >
            Work Experience
          </motion.h2>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="bg-tertiary p-6 rounded-lg relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-8 w-4 h-4 bg-secondary rounded-full transform -translate-x-1/2" />
                
                {/* Timeline line */}
                <div className="absolute left-0 top-8 w-0.5 h-full bg-secondary/30 transform -translate-x-1/2" />

                <div className="ml-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <h3 className="heading-3 text-secondary">{exp.title}</h3>
                    <a
                      href={exp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-textSecondary hover:text-secondary transition-colors"
                    >
                      @{exp.company}
                    </a>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-textSecondary mb-6">
                    <span>{exp.location}</span>
                    <span>•</span>
                    <span>{exp.period}</span>
                  </div>

                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                        className="flex items-start gap-2 text-textSecondary"
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
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="about" className="section-padding bg-tertiary">
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
            About Me
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-primary/50 p-6 rounded-lg"
            >
              <h3 className="heading-3 text-secondary mb-4">Education</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-textPrimary">Bachelor of Software Engineering</h4>
                  <p className="text-textSecondary">Karoon University of Ahwaz</p>
                  <p className="text-textSecondary text-sm">July 2016 - August 2018</p>
                </div>
                <div>
                  <h4 className="font-semibold text-textPrimary">Associate of Software Engineering</h4>
                  <p className="text-textSecondary">Shahid Chamran University of Ahvaz</p>
                  <p className="text-textSecondary text-sm">June 2012 - August 2016</p>
                </div>
              </div>
            </motion.div>

            {/* Experience Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-primary/50 p-6 rounded-lg"
            >
              <h3 className="heading-3 text-secondary mb-4">Experience Summary</h3>
              <p className="text-textSecondary">
                Dynamic Software Engineer with over 3 years of experience in frontend development and UI design.
                Championed multiple projects, leading to significant reduction in defects and enhancement in efficiency.
                Proficient in backend integration, DevOps, and automation, accelerating delivery rates and
                boosting productivity.
              </p>
            </motion.div>
          </div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 bg-primary/50 p-6 rounded-lg"
          >
            <h3 className="heading-3 text-secondary mb-4">Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-textPrimary">JavaScript Code Challenges</h4>
                <p className="text-textSecondary">LinkedIn</p>
                <p className="text-textSecondary text-sm">August 2023</p>
              </div>
              <div>
                <h4 className="font-semibold text-textPrimary">React Design Patterns</h4>
                <p className="text-textSecondary">LinkedIn</p>
                <p className="text-textSecondary text-sm">August 2023</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About 
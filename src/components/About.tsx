import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaGraduationCap, FaBriefcase, FaCertificate } from 'react-icons/fa'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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
    <section id="about" className="section-padding bg-tertiary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
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
              className="heading-2 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            >
              About Me
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education */}
            <motion.div
              variants={itemVariants}
              className="group bg-primary/10 backdrop-blur-sm p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaGraduationCap className="text-3xl text-primary" />
                </motion.div>
                <h3 className="heading-3 text-secondary">Education</h3>
              </div>
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-primary/5 rounded-lg transition-all duration-300 hover:bg-primary/10"
                >
                  <h4 className="font-semibold text-textPrimary">Bachelor of Software Engineering</h4>
                  <p className="text-textSecondary">Karoon University of Ahwaz</p>
                  <p className="text-textSecondary text-sm">July 2016 - August 2018</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-primary/5 rounded-lg transition-all duration-300 hover:bg-primary/10"
                >
                  <h4 className="font-semibold text-textPrimary">Associate of Software Engineering</h4>
                  <p className="text-textSecondary">Shahid Chamran University of Ahvaz</p>
                  <p className="text-textSecondary text-sm">June 2012 - August 2016</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Experience Summary */}
            <motion.div
              variants={itemVariants}
              className="group bg-primary/10 backdrop-blur-sm p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaBriefcase className="text-3xl text-primary" />
                </motion.div>
                <h3 className="heading-3 text-secondary">Experience Summary</h3>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-primary/5 rounded-lg transition-all duration-300 hover:bg-primary/10"
              >
                <p className="text-textSecondary leading-relaxed">
                  Dynamic Software Engineer with over 3 years of experience in frontend development and UI design.
                  Championed multiple projects, leading to significant reduction in defects and enhancement in efficiency.
                  Proficient in backend integration, DevOps, and automation, accelerating delivery rates and
                  boosting productivity.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Certifications */}
          <motion.div
            variants={itemVariants}
            className="mt-12 group bg-primary/10 backdrop-blur-sm p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FaCertificate className="text-3xl text-primary" />
              </motion.div>
              <h3 className="heading-3 text-secondary">Certifications</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-primary/5 rounded-lg transition-all duration-300 hover:bg-primary/10"
              >
                <h4 className="font-semibold text-textPrimary">JavaScript Code Challenges</h4>
                <p className="text-textSecondary">LinkedIn</p>
                <p className="text-textSecondary text-sm">August 2023</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-primary/5 rounded-lg transition-all duration-300 hover:bg-primary/10"
              >
                <h4 className="font-semibold text-textPrimary">React Design Patterns</h4>
                <p className="text-textSecondary">LinkedIn</p>
                <p className="text-textSecondary text-sm">August 2023</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About 
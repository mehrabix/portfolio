import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa'

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const contactInfo = [
    {
      icon: FaEnvelope,
      text: 'mehrabi@post.com',
      link: 'mailto:mehrabi@post.com',
    },
    {
      icon: FaPhone,
      text: '+989211857452',
      link: 'tel:+989211857452',
    },
    {
      icon: FaMapMarkerAlt,
      text: 'Isfahan, Iran',
      link: '#',
    },
  ]

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/mehrabix',
      icon: FaLinkedin,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/mehrabix',
      icon: FaGithub,
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
    <section id="contact" className="section-padding bg-tertiary relative overflow-hidden">
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
              Get in Touch
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <motion.div
              variants={itemVariants}
              className="group bg-tertiary/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300"
            >
              <h3 className="heading-3 text-secondary mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.link}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors duration-300 group"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <info.icon className="w-6 h-6 text-secondary" />
                    </motion.div>
                    <span className="text-textSecondary group-hover:text-secondary transition-colors">
                      {info.text}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="group bg-tertiary/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300"
            >
              <h3 className="heading-3 text-secondary mb-6">Social Links</h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors duration-300 group"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <social.icon className="w-6 h-6 text-secondary" />
                    </motion.div>
                    <span className="text-textSecondary group-hover:text-secondary transition-colors">
                      {social.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact 
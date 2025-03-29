import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      text: 'mehrabi@post.com',
      link: 'mailto:mehrabi@post.com'
    },
    {
      icon: FaPhone,
      title: 'Phone',
      text: '+989211857452',
      link: 'tel:+989211857452'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      text: 'Isfahan, Iran',
      link: '#'
    }
  ]

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/mehrabix', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/mehrabix', label: 'LinkedIn' }
  ]

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
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
          ref={containerRef}
          style={{ y, opacity, scale }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="heading-2 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
              Get In Touch
            </h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <a
                    href={info.link}
                    className="relative p-6 rounded-2xl border border-secondary/10 bg-background/50 backdrop-blur-sm flex items-center gap-4 hover:border-secondary/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <info.icon className="text-2xl text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-textPrimary mb-1">{info.title}</h3>
                      <p className="text-textSecondary hover:text-secondary transition-colors">{info.text}</p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-6 rounded-2xl border border-secondary/10 bg-background/50 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-textPrimary mb-6">Connect With Me</h3>
                <div className="flex gap-6">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-secondary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <social.icon className="text-3xl text-secondary relative z-10" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact 
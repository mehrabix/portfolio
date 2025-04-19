import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const Contact = () => {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: t('contact.email'),
      text: 'mehrabi@post.com',
      link: 'mailto:mehrabi@post.com'
    },
    {
      icon: FaPhone,
      title: t('contact.phone'),
      text: '+989211857452',
      link: 'tel:+989211857452'
    },
    {
      icon: FaMapMarkerAlt,
      title: t('contact.location'),
      text: 'Isfahan, Iran',
      link: '#'
    }
  ]

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/mehrabix', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/mehrabix', label: 'LinkedIn' }
  ]

  return (
    <section id="contact" className="section-padding relative overflow-hidden pb-24 md:pb-16" style={{ position: 'relative' }}>
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
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10" style={{ position: 'relative' }}>
        <motion.div
          ref={containerRef}
          style={{ y, opacity, scale, position: 'relative' }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600" style={{
              textShadow: '0 0 30px rgba(59,130,246,0.4)'
            }}>
              {t('contact.title')}
            </h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ boxShadow: '0 0 15px rgba(59,130,246,0.6)' }}
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
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <a
                    href={info.link}
                    className="relative p-6 rounded-2xl border border-blue-500/20 bg-black/50 backdrop-blur-sm flex items-center gap-4 hover:border-blue-500/40 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <info.icon className="text-2xl text-blue-400" style={{ filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.6))' }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{info.title}</h3>
                      <p className="text-gray-300 hover:text-white transition-colors">{info.text}</p>
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
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-6 rounded-2xl border border-blue-500/20 bg-black/50 backdrop-blur-sm group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <h3 className="text-xl font-semibold text-white mb-6">{t('contact.connectWithMe')}</h3>
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
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-blue-400/50 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                           style={{ boxShadow: '0 0 15px rgba(59,130,246,0.8)' }}
                      />
                      <social.icon className="text-3xl text-white relative z-10" 
                                style={{ filter: 'drop-shadow(0 0 5px rgba(59,130,246,0.8))' }}
                      />
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
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import profileImage from '../assets/ahmadmehrabi.webp'

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/mehrabix', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/mehrabix', label: 'LinkedIn' }
  ]

  return (
    <section id="about" className="section-padding relative overflow-hidden">
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

      {/* Cosmic glow effects similar to Hero */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl"></div>
      <div className="absolute top-2/3 right-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"></div>

      {/* Container with cosmic parallax effect */}
      <div className="container mx-auto px-4 relative z-10">
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
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600" style={{
              textShadow: '0 0 30px rgba(59,130,246,0.4)'
            }}>
              About Me
            </h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ boxShadow: '0 0 15px rgba(59,130,246,0.6)' }}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Profile Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden group">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-900/10 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-800/30 via-purple-900/30 to-blue-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                     style={{
                       backgroundSize: '200% 100%',
                       animation: 'shine 3s linear infinite',
                       boxShadow: '0 0 20px rgba(29,78,216,0.3)'
                     }} 
                />

                {/* Dark overlay for image */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]" />

                {/* Floating particles effect - more similar to Hero */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
                      animate={{
                        x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                        y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                        opacity: [0.3, 0.7, 0.3],
                        scale: [0.8, 1.5, 0.8],
                      }}
                      transition={{
                        duration: Math.random() * 4 + 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{ 
                        boxShadow: '0 0 3px rgba(255,255,255,0.8)' 
                      }}
                    />
                  ))}
                </div>

                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <img
                  src={profileImage}
                  alt="Ahmad Mehrabi"
                  className="w-full h-full object-cover relative z-10"
                />
              </div>

              {/* Social Links - more luminous as in Hero */}
              <div className="flex justify-center gap-6 mt-8">
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
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-xl text-white leading-relaxed" style={{ textShadow: '0 0 2px rgba(255,255,255,0.3)' }}>
                I'm a passionate Full Stack Developer with expertise in modern web technologies.
                With a strong foundation in both frontend and backend development, I create
                scalable and performant applications that deliver exceptional user experiences.
              </p>

              <p className="text-xl text-white leading-relaxed" style={{ textShadow: '0 0 2px rgba(255,255,255,0.3)' }}>
                My journey in software development has been driven by a constant desire to learn
                and innovate. I specialize in building micro-frontend architectures, implementing
                robust state management solutions, and optimizing application performance.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                {['Frontend Development', 'Backend Development', 'DevOps'].map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.1, 
                      boxShadow: '0 0 20px rgba(59,130,246,0.6)' 
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-white rounded-full text-sm hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
                    style={{ boxShadow: '0 0 15px rgba(59,130,246,0.2)' }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About 
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
    { icon: FaGithub, href: 'https://github.com/yourusername', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com/yourusername', label: 'Twitter' },
  ]

  return (
    <section id="about" className="section-padding relative overflow-hidden">
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
              About Me
            </h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                     style={{
                       backgroundSize: '200% 100%',
                       animation: 'shine 3s linear infinite',
                     }} 
                />

                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-secondary/20 rounded-full"
                      initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
                      animate={{
                        x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                        y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ))}
                </div>

                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <img
                  src={profileImage}
                  alt="Ahmad Mehrabi"
                  className="w-full h-full object-cover relative z-10"
                />
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mt-6">
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
                    <social.icon className="text-2xl text-secondary relative z-10" />
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
              <p className="text-lg text-textSecondary leading-relaxed">
                I'm a passionate Full Stack Developer with expertise in modern web technologies.
                With a strong foundation in both frontend and backend development, I create
                scalable and performant applications that deliver exceptional user experiences.
              </p>

              <p className="text-lg text-textSecondary leading-relaxed">
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
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm hover:bg-secondary/20 transition-all duration-300"
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
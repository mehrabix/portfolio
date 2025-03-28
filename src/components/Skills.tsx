import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaCode, FaServer, FaTools, FaShieldAlt, FaUsers, FaCogs } from 'react-icons/fa'

const SkillCard = ({ title, skills, icon: Icon }: { title: string; skills: string[]; icon: any }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group bg-tertiary/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="text-3xl text-secondary" />
        </motion.div>
        <h3 className="heading-3 text-secondary">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm hover:bg-secondary/20 transition-colors duration-300 cursor-default"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const skillCategories = [
    {
      title: 'Frontend Development',
      skills: [
        'JavaScript',
        'TypeScript',
        'CSS',
        'SCSS',
        'TailwindCSS',
        'HTML',
        'React',
        'Next.js',
        'Angular',
        'Rx.js',
        'Svelte',
        'SvelteKit',
        'Lit',
        'Stencil.js',
      ],
      icon: FaCode,
    },
    {
      title: 'Frontend Orchestration',
      skills: [
        'Micro Frontend',
        'Webpack',
        'Rollup',
        'Redux',
        'NgRx',
        'Web Components',
        'Storybook',
      ],
      icon: FaCogs,
    },
    {
      title: 'Backend Development',
      skills: [
        'Node.js',
        'Express',
        'Nest.js',
        'Socket.io',
        'Java',
        'Spring Boot',
        'PL/SQL',
      ],
      icon: FaServer,
    },
    {
      title: 'DevOps & Automation',
      skills: [
        'Linux',
        'Jenkins',
        'Nginx',
        'GitLab CI/CD',
        'Docker',
        'Shell Scripting',
        'YAML',
      ],
      icon: FaTools,
    },
    {
      title: 'Security & Testing',
      skills: [
        'OWASP TOP 10',
        'Cypress',
        'Playwright',
        'Automated Testing',
        'Unit Testing',
      ],
      icon: FaShieldAlt,
    },
    {
      title: 'Methodologies & Collaboration',
      skills: [
        'Agile methodologies',
        'RESTful APIs',
        'Cross-functional collaboration',
        'CI/CD',
      ],
      icon: FaUsers,
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
    <section id="skills" className="section-padding relative overflow-hidden">
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
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.h2
              className="heading-2 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            >
              Skills & Expertise
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <SkillCard {...category} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills 
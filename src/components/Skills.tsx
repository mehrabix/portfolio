import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const SkillCard = ({ title, skills }: { title: string; skills: string[] }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-tertiary p-6 rounded-lg"
    >
      <h3 className="heading-3 text-secondary mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
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
    },
    {
      title: 'Methodologies & Collaboration',
      skills: [
        'Agile methodologies',
        'RESTful APIs',
        'Cross-functional collaboration',
        'CI/CD',
      ],
    },
  ]

  return (
    <section id="skills" className="section-padding">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="heading-2 text-center mb-12"
          >
            Skills & Expertise
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
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
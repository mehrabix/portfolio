import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box } from '@react-three/drei'
import { Suspense } from 'react'

const ProjectCard = ({ title, description, link, technologies }: {
  title: string
  description: string
  link: string
  technologies: string[]
}) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-tertiary p-6 rounded-lg h-full"
    >
      <div className="h-48 mb-6 rounded-lg overflow-hidden">
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Box args={[1, 1, 1]}>
              <meshStandardMaterial
                color="#64ffda"
                wireframe
                transparent
                opacity={0.5}
              />
            </Box>
            <OrbitControls enableZoom={false} autoRotate />
          </Suspense>
        </Canvas>
      </div>
      
      <h3 className="heading-3 text-secondary mb-4">{title}</h3>
      <p className="text-textSecondary mb-4">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {technologies.map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-secondary hover:text-secondary/80 transition-colors"
      >
        View Project →
      </a>
    </motion.div>
  )
}

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const projects = [
    {
      title: 'Easymed',
      description: 'A comprehensive SaaS platform for electronic healthcare services, including EHR, e-prescribing, health monitoring, and SePAS system integration.',
      link: 'https://easymed.ir/',
      technologies: ['React', 'TypeScript', 'Micro Frontends', 'Webpack', 'Docker'],
    },
    {
      title: 'Darmanmobile',
      description: 'A project for Iran Insurance Company, which holds over 50% of the commercial insurance market, delivering a wide range of products.',
      link: 'https://darmanmobile.iraninsurance.ir/',
      technologies: ['React', 'Angular', 'RxJS', 'NgRx', 'Jenkins'],
    },
  ]

  return (
    <section id="projects" className="section-padding bg-tertiary">
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
            Featured Projects
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects 
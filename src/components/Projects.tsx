import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub, FaExternalLinkAlt, FaNpm } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useLanguage } from '../context/LanguageContext';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
  image?: string;
  features?: string[];
  npm?: string[];
}

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-black/50 backdrop-blur-sm rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-100 h-full flex flex-col relative overflow-hidden"
    >
      {/* Enhanced background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
           style={{
             backgroundSize: '200% 100%',
             animation: 'shine 3s linear infinite',
           }} 
      />

      <div className="p-8 relative z-10 flex flex-col h-full">
        <motion.h3 
          className="text-2xl font-semibold mb-3 text-blue-400 relative z-10"
          animate={{
            scale: isHovered ? 1.05 : 1,
            y: isHovered ? -5 : 0,
          }}
          transition={{ duration: 0.2 }}
          style={{ textShadow: '0 0 10px rgba(59,130,246,0.3)' }}
        >
          {project.title}
        </motion.h3>
        
        <div className="flex-1 min-h-[120px]">
          <p className="text-gray-300 text-base leading-relaxed">
            {project.description}
          </p>
        </div>

        {project.features && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-blue-400 mb-2">
              {t('projects.features')}:
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-1.5">
              {project.features.map((feature, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="leading-relaxed"
                >
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech, techIndex) => (
            <motion.span
              key={techIndex}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 15px rgba(59,130,246,0.3)',
              }}
              className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 text-blue-300 rounded-full text-sm hover:bg-blue-500/20 transition-all duration-300 cursor-default min-w-fit"
            >
              {tech}
            </motion.span>
          ))}
        </div>
        
        <div className="flex gap-4 mt-auto pt-4">
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="text-blue-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
              style={{ filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.6))' }}
            >
              <FaGithub className="text-xl" />
              <span>{t('projects.github')}</span>
            </motion.a>
          )}
          {project.demo && (
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="text-blue-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
              style={{ filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.6))' }}
            >
              <FaExternalLinkAlt className="text-xl" />
              <span>{t('projects.liveDemo')}</span>
            </motion.a>
          )}
          {project.npm && project.npm.length > 0 && (
            <motion.a
              href={project.npm[0]}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="text-blue-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
              style={{ filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.6))' }}
            >
              <FaNpm className="text-xl" />
              <span>{t('projects.npm')}</span>
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [showAll, setShowAll] = useState(false);

  // Moved the projects data inside the component to access the t function
  const projects: Project[] = [
    {
      title: t('projects.datepicker.title'),
      description: t('projects.datepicker.description'),
      technologies: ["TypeScript", "Web Components", "CSS", "Jalali Calendar", "Framework Agnostic", "Rspack"],
      features: [
        t('projects.datepicker.feature1'),
        t('projects.datepicker.feature2'),
        t('projects.datepicker.feature3'),
        t('projects.datepicker.feature4'),
        t('projects.datepicker.feature5'),
        t('projects.datepicker.feature6'),
        t('projects.datepicker.feature7'),
        t('projects.datepicker.feature8'),
        t('projects.datepicker.feature9')
      ],
      github: "https://github.com/mehrabix/persian-datepicker-element",
      demo: "http://mehrabix.github.io/persian-datepicker-element",
      npm: [
        "https://www.npmjs.com/package/persian-datepicker-element",
        "https://www.npmjs.com/package/react-persian-datepicker-element",
        "https://www.npmjs.com/package/ngx-persian-datepicker-element",
        "https://www.npmjs.com/package/vue-persian-datepicker-element"
      ]
    },
    {
      title: t('projects.boilerplate.title'),
      description: t('projects.boilerplate.description'),
      technologies: ["TypeScript", "Web Components", "Lit.js", "Rspack", "TailwindCSS", "esbuild"],
      features: [
        t('projects.boilerplate.feature1'),
        t('projects.boilerplate.feature2'),
        t('projects.boilerplate.feature3'),
        t('projects.boilerplate.feature4'),
        t('projects.boilerplate.feature5'),
        t('projects.boilerplate.feature6'),
        t('projects.boilerplate.feature7'),
        t('projects.boilerplate.feature8')
      ],
      github: "https://github.com/litpack/create",
      npm: [
        "https://www.npmjs.com/package/create-litpack"
      ]
    },
    {
      title: t('projects.easymed.title'),
      description: t('projects.easymed.description'),
      technologies: ["React", "Angular", "Spring Boot", "NestJS", "PL/SQL", "Microservices", "DevOps"],
      features: [
        t('projects.easymed.feature1'),
        t('projects.easymed.feature2'),
        t('projects.easymed.feature3')
      ],
      demo: "https://easymed.ir/"
    },
    {
      title: t('projects.darman.title'),
      description: t('projects.darman.description'),
      technologies: ["Micro-frontends", "GitLab CI", "Jenkins", "Ansible", "Kubernetes", "React", "Angular"],
      features: [
        t('projects.darman.feature1'),
        t('projects.darman.feature2'),
        t('projects.darman.feature3')
      ],
      demo: "https://darmanmobile.iraninsurance.ir/"
    }
  ];

  const visibleProjects = showAll ? projects : projects.slice(0, 3);

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
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
      
      {/* Cosmic particles background */}
      <div className="absolute -z-10 w-full h-full">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars radius={100} depth={50} count={800} factor={4} saturation={0} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Cosmic glow effects */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              style={{ textShadow: '0 0 30px rgba(59,130,246,0.4)' }}
            >
              {t('projects.title')}
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"
              style={{ boxShadow: '0 0 15px rgba(59,130,246,0.6)' }}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {visibleProjects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>

          {projects.length > 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex justify-center mt-12"
            >
              <motion.button
                onClick={() => setShowAll(!showAll)}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59,130,246,0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
              >
                <span className="relative z-10">{showAll ? t('projects.showLess') : t('projects.viewAll')}</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
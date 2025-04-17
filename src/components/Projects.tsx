import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub, FaExternalLinkAlt, FaNpm, FaChevronRight, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useLanguage } from '../context/LanguageContext';
import OrbitalSystem from './ProjectOrbits';

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

const ProjectCard = ({ project, index, isCurrent, direction, total }: 
  { project: Project; index: number; isCurrent: boolean; direction: number; total: number }) => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  
  // Card tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate position based on current index for the carousel
  const variants = {
    center: { 
      x: 0, 
      scale: 1, 
      opacity: 1,
      zIndex: 10, 
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    left: { 
      x: '-120%', 
      scale: 0.8, 
      opacity: 0.3,
      zIndex: 5, 
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    right: { 
      x: '120%', 
      scale: 0.8, 
      opacity: 0.3,
      zIndex: 5, 
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  const getVariants = () => {
    if (isCurrent) return "center";
    if (index < direction) return "left";
    return "right";
  };

  return (
    <motion.div
      className="h-full absolute inset-0"
      variants={variants}
      initial={direction < index ? "right" : "left"}
      animate={getVariants()}
      exit={index < direction ? "left" : "right"}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ 
          rotateX: isMobile ? 0 : rotateX, 
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          perspective: 1000
        }}
        className="group h-full bg-black/70 backdrop-blur-xl rounded-xl overflow-hidden border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 relative flex flex-col w-full max-w-4xl mx-auto"
      >
        {/* Glass effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          style={{ transform: 'translateZ(-10px)' }} />
        
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
          style={{ 
            backgroundSize: '200% 100%',
            animation: 'shine 3s linear infinite',
            transform: 'translateZ(-5px)'
          }} 
        />

        {/* Animated glow on hover */}
        <motion.div
          className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 blur-xl"
          animate={{ opacity: isHovered ? 0.15 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ backgroundSize: '200% 100%' }}
        />

        <div className="p-6 md:p-8 relative z-10 flex flex-col h-full overflow-auto custom-scrollbar" style={{ transform: 'translateZ(20px)' }}>
          {/* Pagination indicator */}
          <div className="absolute top-6 right-6 flex items-center gap-2 text-blue-400/80 text-sm font-mono">
            <span className="text-blue-500 font-bold">{index + 1}</span>
            <span className="opacity-50">/</span>
            <span className="opacity-50">{total}</span>
          </div>

          <motion.h3 
            className="text-2xl sm:text-3xl font-semibold mb-4 text-blue-400 pr-12"
            animate={{
              scale: isHovered ? 1.02 : 1,
              y: isHovered ? -2 : 0,
            }}
            transition={{ duration: 0.2 }}
            style={{ textShadow: '0 0 15px rgba(59,130,246,0.3)', transform: 'translateZ(10px)' }}
          >
            {project.title}
          </motion.h3>
          
          <div className="flex-1 mb-6 max-w-3xl">
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Two columns layout for larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Left column: Technologies */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-blue-400 mb-2 font-medium">
                {t('projects.technologies')}
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, techIndex) => (
                  <motion.span
                    key={techIndex}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 15px rgba(59,130,246,0.3)',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (techIndex * 0.05), duration: 0.3 }}
                    style={{ transform: 'translateZ(15px)' }}
                    className="inline-flex items-center px-2 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs hover:bg-blue-500/20 transition-all duration-300 cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
            
            {/* Right column: Features section with toggle */}
            {project.features && (
              <div className="features-container">
                <h4 className="text-xs uppercase tracking-wider text-blue-400 mb-2 font-medium flex items-center gap-2">
                  {t('projects.features')}
                  <motion.span
                    animate={{ rotate: showFeatures ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block cursor-pointer"
                    onClick={() => setShowFeatures(!showFeatures)}
                  >
                    <FaChevronRight size={10} />
                  </motion.span>
                </h4>
                
                <AnimatePresence>
                  {showFeatures && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto', maxHeight: '200px' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-y-auto custom-scrollbar pr-2"
                      style={{ transform: 'translateZ(5px)' }}
                    >
                      <ul className="list-disc list-inside text-xs text-gray-400 space-y-1 ml-2">
                        {project.features.map((feature, idx) => (
                          <motion.li 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.2 }}
                            className="leading-tight"
                          >
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!showFeatures && (
                  <motion.button
                    onClick={() => setShowFeatures(true)}
                    className="text-blue-400 text-xs hover:text-blue-300 underline underline-offset-2 decoration-blue-500/30"
                    whileHover={{ x: 2 }}
                  >
                    {t('projects.showFeatures')}
                  </motion.button>
                )}
              </div>
            )}
          </div>
          
          {/* Links section */}
          <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-blue-900/20">
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg transition-colors duration-300 flex items-center gap-2 backdrop-blur-sm text-sm"
                style={{ filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.6))', transform: 'translateZ(15px)' }}
              >
                <FaGithub className="text-lg" />
                <span>{t('projects.github')}</span>
              </motion.a>
            )}
            {project.demo && (
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600 text-white px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/20 text-sm"
                style={{ transform: 'translateZ(15px)' }}
              >
                <FaExternalLinkAlt className="text-lg" />
                <span>{t('projects.liveDemo')}</span>
              </motion.a>
            )}
            {project.npm && project.npm.length > 0 && (
              <motion.a
                href={project.npm[0]}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg transition-colors duration-300 flex items-center gap-2 backdrop-blur-sm text-sm"
                style={{ filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.6))', transform: 'translateZ(15px)' }}
              >
                <FaNpm className="text-lg" />
                <span>{t('projects.npm')}</span>
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Projects data
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

  // Navigation functions
  const nextProject = () => {
    setDirection(currentIndex);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setDirection(currentIndex);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Auto-scroll functionality with pause on hover
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      nextProject();
    }, 8000); // Change every 8 seconds when not hovering
    
    return () => clearInterval(interval);
  }, [currentIndex, isHovering]);

  return (
    <section 
      id="projects" 
      className="min-h-screen py-20 relative overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background effects - darker background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent"></div>
        <Canvas className="absolute inset-0">
          <Stars radius={300} depth={100} count={1000} factor={4} saturation={0} fade speed={0.5} />
          <OrbitalSystem />
        </Canvas>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ textShadow: '0 0 20px rgba(59,130,246,0.3)' }}
          >
            {t('projects.title')}
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t('projects.subtitle')}
          </motion.p>
        </motion.div>

        {/* Project showcase carousel - adjust height */}
        <div 
          ref={containerRef}
          className="relative h-[600px] sm:h-[550px] md:h-[500px] w-full max-w-5xl mx-auto my-12"
          style={{ position: 'relative' }}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <ProjectCard 
              key={currentIndex} 
              project={projects[currentIndex]} 
              index={currentIndex} 
              isCurrent={true} 
              direction={direction}
              total={projects.length}
            />
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-8 mt-8">
            <motion.button
              onClick={prevProject}
              className="bg-blue-500/10 hover:bg-blue-500/30 text-blue-400 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
            >
              <FaArrowLeft />
            </motion.button>
            
            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {projects.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(currentIndex < index ? currentIndex : index);
                    setCurrentIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-blue-500 w-5'
                      : 'bg-blue-500/30 hover:bg-blue-500/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
            
            <motion.button
              onClick={nextProject}
              className="bg-blue-500/10 hover:bg-blue-500/30 text-blue-400 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
            >
              <FaArrowRight />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
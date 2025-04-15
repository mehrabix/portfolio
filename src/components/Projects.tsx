import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub, FaExternalLinkAlt, FaNpm } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

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

const projects: Project[] = [
  {
    title: "Persian Date Picker",
    description: "A modern, framework-agnostic web component for Persian (Jalali) calendar date selection. Built with TypeScript and Web Components, it works seamlessly across all major frameworks (React, Vue, Angular) and vanilla JavaScript/TypeScript projects. Features a beautiful UI and comprehensive functionality while maintaining complete framework independence.",
    technologies: ["TypeScript", "Web Components", "CSS", "Jalali Calendar", "Framework Agnostic", "Rspack"],
    features: [
      "Works with any framework (React, Vue, Angular) or vanilla JS/TS",
      "Range selection support",
      "Holiday highlighting",
      "RTL support",
      "Touch gesture support",
      "Customizable styling",
      "Event tooltips",
      "Min/Max date constraints",
      "Disabled dates handling"
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
    title: "Frontend WebComponent Boilerplate",
    description: "A powerful boilerplate for creating modern web applications using Web Components. Built with Rspack, Lit.js, TypeScript, and TailwindCSS, it provides a robust foundation for building framework-agnostic web applications. Features hot module replacement, optimized builds, and modern development tools.",
    technologies: ["TypeScript", "Web Components", "Lit.js", "Rspack", "TailwindCSS", "esbuild"],
    features: [
      "Modern JavaScript and TypeScript support with esbuild",
      "Reactive state management using Preact Signals",
      "Hot Module Replacement (HMR) for efficient development",
      "CSS processing with TailwindCSS and PostCSS",
      "Optimized asset handling using Rspack",
      "Compression of assets for production",
      "Source maps for easier debugging",
      "Framework-agnostic architecture"
    ],
    github: "https://github.com/litpack/create",
    npm: [
      "https://www.npmjs.com/package/create-litpack"
    ]
  },
  {
    title: "Easymed EHR Platform",
    description: "Developed a SaaS platform for electronic healthcare services, including EHR, e-prescribing, and monitoring. Focused on improving healthcare operations and management.",
    technologies: ["React", "Angular", "Spring Boot", "NestJS", "PL/SQL", "Microservices", "DevOps"],
    features: [
      "SaaS Platform Development", 
      "EHR & E-prescribing Features", 
      "Health Monitoring Integration", 
    ],
    demo: "https://easymed.ir/"
  },
  {
    title: "Darmanmobile Insurance Project",
    description: "Contributed to a major project for Iran Insurance Company, supporting diverse insurance products and underwriting for large national initiatives.",
    technologies: ["Micro-frontends", "GitLab CI", "Jenkins", "Ansible", "Kubernetes", "React", "Angular"],
    features: [
      "Large-scale Insurance Platform", 
      "National Project Underwriting Support", 
      "Risk Management Features",
    ],
    demo: "https://darmanmobile.iraninsurance.ir/"
  }
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
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
              Features:
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
              <span>GitHub</span>
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
              <span>Live Demo</span>
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
              <span>npm</span>
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-black z-0"></div>
      
      {/* Star field */}
      <div className="absolute inset-0 opacity-90 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0), 
                            radial-gradient(circle at 3px 3px, rgba(136, 96, 208, 0.15) 1px, transparent 0)`,
          backgroundSize: '30px 30px, 50px 50px'
        }} />
      </div>

      {/* 3D Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      {/* Cosmic glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl z-0"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          style={{ textShadow: '0 0 30px rgba(59,130,246,0.4)' }}
        >
          Projects
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
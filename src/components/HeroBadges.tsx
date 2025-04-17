import React from 'react';
import { motion } from 'framer-motion';
import FloatingBadge from './FloatingBadge';
import { 
  FaCode, 
  FaReact, 
  FaBrain, 
  FaServer, 
  FaDatabase, 
  FaTools 
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const HeroBadges: React.FC = () => {
  const { t } = useLanguage();
  
  const badges = [
    { 
      text: t('badges.frontend'), 
      icon: <FaReact />, 
      className: 'top-16 -right-8 md:right-16',
      glowColor: 'rgba(59, 130, 246, 0.5)'
    },
    { 
      text: t('badges.backend'), 
      icon: <FaServer />, 
      className: 'bottom-32 right-4 md:right-32',
      glowColor: 'rgba(124, 58, 237, 0.5)'
    },
    { 
      text: t('badges.database'), 
      icon: <FaDatabase />, 
      className: 'top-24 -left-8 md:left-20',
      glowColor: 'rgba(236, 72, 153, 0.5)'
    },
    { 
      text: t('badges.architecture'), 
      icon: <FaTools />, 
      className: 'bottom-16 left-4 md:left-36',
      glowColor: 'rgba(34, 197, 94, 0.5)'
    },
    { 
      text: t('badges.problemSolver'), 
      icon: <FaBrain />, 
      className: 'top-40 left-1/2 transform -translate-x-1/2',
      glowColor: 'rgba(249, 115, 22, 0.5)'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {badges.map((badge, index) => (
        <FloatingBadge
          key={index}
          text={badge.text}
          icon={badge.icon}
          className={`absolute ${badge.className}`}
          glowColor={badge.glowColor}
        />
      ))}
    </motion.div>
  );
};

export default HeroBadges; 
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  glass = false 
}) => {
  const baseClasses = "rounded-2xl shadow-lg border";
  const glassClasses = glass 
    ? "bg-white/20 backdrop-blur-sm border-white/30" 
    : "bg-white border-gray-200";
  
  return (
    <motion.div
      className={`${baseClasses} ${glassClasses} ${className}`}
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
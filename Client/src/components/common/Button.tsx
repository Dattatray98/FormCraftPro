import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  style
}) => {
  const baseClasses = "font-semibold rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 justify-center";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 shadow-blue-200",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-red-200"
  };

  const sizeClasses = {
    sm: "py-2 px-3 sm:px-4 text-xs sm:text-sm",
    md: "py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base",
    lg: "py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={style}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
    </motion.button>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'spinner',
  color = 'blue',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    gray: 'text-gray-500'
  };
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };
  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };
  const dotsVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const dotVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };
  const waveVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const waveBarVariants = {
    animate: {
      scaleY: [1, 2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };
  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
            variants={pulseVariants}
            animate="animate"
          >
            <div className="w-full h-full bg-current rounded-full" />
          </motion.div>
        );
      case 'dots':
        return (
          <motion.div
            className={`flex space-x-1 ${className}`}
            variants={dotsVariants}
            animate="animate"
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 ${colorClasses[color]} bg-current rounded-full`}
                variants={dotVariants}
              />
            ))}
          </motion.div>
        );
      case 'wave':
        return (
          <motion.div
            className={`flex items-end space-x-1 ${className}`}
            variants={waveVariants}
            animate="animate"
          >
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className={`w-1 h-4 ${colorClasses[color]} bg-current rounded-full`}
                variants={waveBarVariants}
              />
            ))}
          </motion.div>
        );
      case 'orbit':
        return (
          <div className={`relative ${sizeClasses[size]} ${className}`}>
            <motion.div
              className="absolute inset-0"
              variants={spinnerVariants}
              animate="animate"
            >
              <div className={`w-2 h-2 ${colorClasses[color]} bg-current rounded-full absolute top-0 left-1/2 transform -translate-x-1/2`} />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              variants={spinnerVariants}
              animate="animate"
              style={{ animationDelay: '0.5s' }}
            >
              <div className={`w-1.5 h-1.5 ${colorClasses[color]} bg-current rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-60`} />
            </motion.div>
          </div>
        );
      case 'gradient':
        return (
          <motion.div
            className={`${sizeClasses[size]} ${className}`}
            variants={spinnerVariants}
            animate="animate"
          >
            <div className="w-full h-full rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-border">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 border-2 border-transparent" />
            </div>
          </motion.div>
        );
      default: // spinner
        return (
          <motion.div
            className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
            variants={spinnerVariants}
            animate="animate"
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="31.416"
                strokeDashoffset="31.416"
                fill="none"
                className="opacity-25"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="31.416"
                strokeDashoffset="23.562"
                fill="none"
              />
            </svg>
          </motion.div>
        );
    }
  };
  return renderSpinner();
};
// Loading overlay component
export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  spinner = 'spinner',
  message = 'Loading...',
  className = '' 
}) => {
  if (!isLoading) return children;
  return (
    <div className={`relative ${className}`}>
      {children}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="text-center">
          <LoadingSpinner variant={spinner} size="lg" />
          {message && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
export default LoadingSpinner;

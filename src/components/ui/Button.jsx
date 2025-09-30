import React from 'react';
import { motion } from 'framer-motion';
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  animate = true,
  ...props 
}) => {
  const baseClasses = 'btn-base';
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    glass: 'btn-glass',
    gradient: 'btn-gradient',
    outline: 'btn-outline',
    danger: 'btn-danger',
    success: 'btn-success',
    warning: 'btn-warning'
  };
  const sizes = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl'
  };
  const combinedClasses = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${disabled ? 'btn-disabled' : ''} 
    ${loading ? 'btn-loading' : ''} 
    ${className}
  `.trim().replace(/\s+/g, ' ');
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  const iconVariants = {
    initial: { rotate: 0 },
    hover: { 
      rotate: loading ? 360 : 0,
      transition: {
        duration: loading ? 1 : 0.3,
        repeat: loading ? Infinity : 0,
        ease: "linear"
      }
    }
  };
  const renderContent = () => (
    <>
      {Icon && iconPosition === 'left' && (
        <motion.span 
          className="btn-icon"
          variants={iconVariants}
          initial="initial"
          animate={loading ? "hover" : "initial"}
        >
          <Icon className="w-4 h-4" />
        </motion.span>
      )}
      {loading && (
        <motion.div
          className="btn-spinner"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        </motion.div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
      {Icon && iconPosition === 'right' && (
        <motion.span 
          className="btn-icon"
          variants={iconVariants}
          initial="initial"
          animate={loading ? "hover" : "initial"}
        >
          <Icon className="w-4 h-4" />
        </motion.span>
      )}
    </>
  );
  if (animate && !disabled) {
    return (
      <motion.button
        className={combinedClasses}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        disabled={disabled || loading}
        {...props}
      >
        {renderContent()}
      </motion.button>
    );
  }
  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};
// Specialized button components
export const GlassButton = ({ children, className = '', ...props }) => (
  <Button variant="glass" className={className} {...props}>
    {children}
  </Button>
);
export const GradientButton = ({ children, className = '', ...props }) => (
  <Button variant="gradient" className={className} {...props}>
    {children}
  </Button>
);
export const IconButton = ({ icon: Icon, size = 'md', className = '', ...props }) => (
  <Button 
    variant="ghost" 
    size={size} 
    className={`btn-icon-only ${className}`} 
    {...props}
  >
    <Icon className="w-5 h-5" />
  </Button>
);
export const FloatingActionButton = ({ 
  icon: Icon, 
  className = '', 
  position = 'bottom-right',
  ...props 
}) => {
  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };
  return (
    <motion.div
      className={`${positions[position]} z-50`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <Button 
        variant="primary" 
        size="lg" 
        className={`btn-fab shadow-2xl ${className}`}
        {...props}
      >
        <Icon className="w-6 h-6" />
      </Button>
    </motion.div>
  );
};
export const ButtonGroup = ({ children, className = '', orientation = 'horizontal' }) => {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };
  return (
    <div className={`btn-group ${orientationClasses[orientation]} ${className}`}>
      {children}
    </div>
  );
};
export default Button;

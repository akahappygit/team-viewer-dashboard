import React from 'react';
import { motion } from 'framer-motion';
const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  animate = true,
  ...props 
}) => {
  const baseClasses = 'dashboard-card';
  const variants = {
    default: '',
    glass: 'glass-card',
    chart: 'chart-glass',
    interactive: 'interactive-lift',
    minimal: 'bg-white/5 backdrop-blur-sm border border-white/10'
  };
  const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: hover ? {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    } : {}
  };
  if (animate) {
    return (
      <motion.div
        className={combinedClasses}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};
// Specialized card components
export const GlassCard = ({ children, className = '', ...props }) => (
  <Card variant="glass" className={className} {...props}>
    {children}
  </Card>
);
export const ChartCard = ({ children, className = '', ...props }) => (
  <Card variant="chart" className={className} {...props}>
    {children}
  </Card>
);
export const InteractiveCard = ({ children, className = '', ...props }) => (
  <Card variant="interactive" className={className} {...props}>
    {children}
  </Card>
);
export const MinimalCard = ({ children, className = '', ...props }) => (
  <Card variant="minimal" className={className} {...props}>
    {children}
  </Card>
);
// Stats card with icon and animation
export const StatsCard = ({ 
  title, 
  value, 
  change, 
  trend = 'up', 
  icon: Icon, 
  color = 'blue',
  className = '',
  ...props 
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
  };
  const trendClasses = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };
  return (
    <InteractiveCard className={className} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </p>
          {change && (
            <p className={`text-sm font-medium ${trendClasses[trend]}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${colorClasses[color]} animate-float`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </InteractiveCard>
  );
};
export default Card;

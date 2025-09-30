import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
const Badge = ({
  children,
  variant = 'default',
  size = 'default',
  className,
  removable = false,
  onRemove,
  icon,
  pulse = false,
  ...props
}) => {
  const baseClasses = "inline-flex items-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700",
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50",
    secondary: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50",
    info: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 hover:bg-cyan-200 dark:hover:bg-cyan-900/50",
    outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
    solid: "bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
  };
  const sizes = {
    sm: "px-2 py-0.5 text-xs rounded-md",
    default: "px-2.5 py-0.5 text-sm rounded-md",
    lg: "px-3 py-1 text-base rounded-lg"
  };
  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };
  return (
    <motion.span
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        pulse && "animate-pulse",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {icon && (
        <span className="mr-1">
          {React.cloneElement(icon, { 
            className: cn(
              "h-3 w-3",
              size === 'sm' && "h-2.5 w-2.5",
              size === 'lg' && "h-4 w-4"
            ) 
          })}
        </span>
      )}
      {children}
      {removable && (
        <button
          onClick={handleRemove}
          className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          <X className={cn(
            "h-3 w-3",
            size === 'sm' && "h-2.5 w-2.5",
            size === 'lg' && "h-4 w-4"
          )} />
        </button>
      )}
    </motion.span>
  );
};
// Specialized Badge Components
const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    active: { variant: 'success', children: 'Active' },
    inactive: { variant: 'danger', children: 'Inactive' },
    pending: { variant: 'warning', children: 'Pending' },
    completed: { variant: 'success', children: 'Completed' },
    draft: { variant: 'default', children: 'Draft' },
    published: { variant: 'primary', children: 'Published' },
    archived: { variant: 'outline', children: 'Archived' }
  };
  const config = statusConfig[status] || { variant: 'default', children: status };
  return <Badge {...config} {...props} />;
};
const PriorityBadge = ({ priority, ...props }) => {
  const priorityConfig = {
    low: { variant: 'success', children: 'Low Priority' },
    medium: { variant: 'warning', children: 'Medium Priority' },
    high: { variant: 'danger', children: 'High Priority' },
    urgent: { variant: 'danger', children: 'Urgent', pulse: true }
  };
  const config = priorityConfig[priority] || { variant: 'default', children: priority };
  return <Badge {...config} {...props} />;
};
const CountBadge = ({ count, max = 99, showZero = false, ...props }) => {
  if (!showZero && count === 0) return null;
  const displayCount = count > max ? `${max}+` : count;
  return (
    <Badge
      variant="danger"
      size="sm"
      className="min-w-[1.25rem] h-5 rounded-full flex items-center justify-center p-0 text-xs font-bold"
      {...props}
    >
      {displayCount}
    </Badge>
  );
};
const DotBadge = ({ variant = 'default', size = 'default', className, ...props }) => {
  const dotSizes = {
    sm: 'h-2 w-2',
    default: 'h-2.5 w-2.5',
    lg: 'h-3 w-3'
  };
  return (
    <span
      className={cn(
        "inline-block rounded-full",
        variants[variant]?.replace(/text-\w+-\d+/g, '').replace(/hover:\w+-\w+-\d+/g, ''),
        dotSizes[size],
        className
      )}
      {...props}
    />
  );
};
const AnimatedBadge = ({ 
  children, 
  animation = 'bounce',
  duration = 1,
  ...props 
}) => {
  const animations = {
    bounce: {
      animate: {
        y: [0, -4, 0],
        transition: {
          duration,
          repeat: Infinity,
          repeatType: "reverse"
        }
      }
    },
    pulse: {
      animate: {
        scale: [1, 1.1, 1],
        transition: {
          duration,
          repeat: Infinity,
          repeatType: "reverse"
        }
      }
    },
    shake: {
      animate: {
        x: [0, -2, 2, -2, 2, 0],
        transition: {
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: duration
        }
      }
    },
    glow: {
      animate: {
        boxShadow: [
          "0 0 0 0 rgba(59, 130, 246, 0)",
          "0 0 0 4px rgba(59, 130, 246, 0.3)",
          "0 0 0 0 rgba(59, 130, 246, 0)"
        ],
        transition: {
          duration,
          repeat: Infinity,
          repeatType: "reverse"
        }
      }
    }
  };
  return (
    <motion.div {...animations[animation]}>
      <Badge {...props}>
        {children}
      </Badge>
    </motion.div>
  );
};
const BadgeGroup = ({ children, className, spacing = 'default' }) => {
  const spacings = {
    tight: 'gap-1',
    default: 'gap-2',
    loose: 'gap-3'
  };
  return (
    <div className={cn("flex flex-wrap items-center", spacings[spacing], className)}>
      {children}
    </div>
  );
};
export {
  Badge,
  StatusBadge,
  PriorityBadge,
  CountBadge,
  DotBadge,
  AnimatedBadge,
  BadgeGroup
};

import React from 'react';
import { motion } from 'framer-motion';
const StaggeredList = ({ 
  children, 
  className = '',
  stagger = 0.1,
  duration = 0.5,
  direction = 'up' // up, down, left, right
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'down':
        return { y: -20, opacity: 0 };
      case 'left':
        return { x: 20, opacity: 0 };
      case 'right':
        return { x: -20, opacity: 0 };
      default: // up
        return { y: 20, opacity: 0 };
    }
  };
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: getInitialPosition(),
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
        duration
      }
    }
  };
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};
export default StaggeredList;

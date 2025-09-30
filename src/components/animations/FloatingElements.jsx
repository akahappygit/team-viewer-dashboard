import React from 'react';
import { motion } from 'framer-motion';
const FloatingElements = ({ count = 6, className = '' }) => {
  const elements = Array.from({ length: count }, (_, i) => i);
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 6 + Math.random() * 4, // Random duration between 6-10s
        repeat: Infinity,
        ease: 'easeInOut',
        delay: Math.random() * 2 // Random delay up to 2s
      }
    }
  };
  const getRandomPosition = () => ({
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
  });
  const getRandomSize = () => {
    const size = Math.random() * 60 + 20; // 20-80px
    return { width: size, height: size };
  };
  const getRandomColor = () => {
    const colors = [
      'bg-blue-500/10',
      'bg-purple-500/10',
      'bg-green-500/10',
      'bg-yellow-500/10',
      'bg-pink-500/10',
      'bg-indigo-500/10'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const getRandomShape = () => {
    const shapes = ['rounded-full', 'rounded-lg', 'rounded-xl'];
    return shapes[Math.floor(Math.random() * shapes.length)];
  };
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {elements.map((_, index) => (
        <motion.div
          key={index}
          className={`absolute ${getRandomColor()} ${getRandomShape()} backdrop-blur-sm`}
          style={{
            ...getRandomPosition(),
            ...getRandomSize(),
            zIndex: -1
          }}
          variants={floatingVariants}
          animate="animate"
        />
      ))}
    </div>
  );
};
export default FloatingElements;

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
// Toast Context
const ToastContext = createContext();
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
// Toast Provider
export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
      createdAt: Date.now()
    };
    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });
    // Auto remove toast
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
    return id;
  }, [maxToasts]);
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);
  // Convenience methods
  const toast = useCallback((message, options = {}) => {
    return addToast({ message, ...options });
  }, [addToast]);
  const success = useCallback((message, options = {}) => {
    return addToast({ message, type: 'success', ...options });
  }, [addToast]);
  const error = useCallback((message, options = {}) => {
    return addToast({ message, type: 'error', duration: 7000, ...options });
  }, [addToast]);
  const warning = useCallback((message, options = {}) => {
    return addToast({ message, type: 'warning', ...options });
  }, [addToast]);
  const info = useCallback((message, options = {}) => {
    return addToast({ message, type: 'info', ...options });
  }, [addToast]);
  const loading = useCallback((message, options = {}) => {
    return addToast({ message, type: 'loading', duration: 0, ...options });
  }, [addToast]);
  const promise = useCallback(async (promise, options = {}) => {
    const {
      loading: loadingMessage = 'Loading...',
      success: successMessage = 'Success!',
      error: errorMessage = 'Something went wrong'
    } = options;
    const toastId = loading(loadingMessage);
    try {
      const result = await promise;
      removeToast(toastId);
      success(typeof successMessage === 'function' ? successMessage(result) : successMessage);
      return result;
    } catch (err) {
      removeToast(toastId);
      error(typeof errorMessage === 'function' ? errorMessage(err) : errorMessage);
      throw err;
    }
  }, [loading, success, error, removeToast]);
  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    toast,
    success,
    error,
    warning,
    info,
    loading,
    promise
  };
  const positions = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  };
  return (
    <ToastContext.Provider value={value}>
      {children}
      {}
      <div className={cn("fixed z-50 flex flex-col gap-2", positions[position])}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
// Toast Component
const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  action,
  onClose,
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  React.useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [duration]);
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    loading: motion.div
  };
  const variants = {
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    loading: "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200"
  };
  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
    loading: "text-gray-500"
  };
  const Icon = icons[type];
  const toastVariants = {
    initial: {
      opacity: 0,
      y: -50,
      scale: 0.3
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.5,
      transition: {
        duration: 0.2
      }
    }
  };
  return (
    <motion.div
      className={cn(
        "relative w-80 max-w-sm p-4 rounded-lg border shadow-lg backdrop-blur-sm",
        variants[type],
        className
      )}
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      {...props}
    >
      {}
      {duration > 0 && (
        <div className="absolute top-0 left-0 h-1 bg-black/10 dark:bg-white/10 rounded-t-lg overflow-hidden">
          <motion.div
            className="h-full bg-current opacity-30"
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      )}
      <div className="flex items-start gap-3">
        {}
        <div className={cn("flex-shrink-0 mt-0.5", iconColors[type])}>
          {type === 'loading' ? (
            <motion.div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
        {}
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-medium text-sm mb-1">
              {title}
            </div>
          )}
          <div className="text-sm opacity-90">
            {message}
          </div>
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
        {}
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
// Toast Hook for easier usage
export const toast = {
  success: (message, options) => {
    // This will be replaced by the actual implementation when used within ToastProvider
    console.log('Toast success:', message);
  },
  error: (message, options) => {
    console.log('Toast error:', message);
  },
  warning: (message, options) => {
    console.log('Toast warning:', message);
  },
  info: (message, options) => {
    console.log('Toast info:', message);
  },
  loading: (message, options) => {
    console.log('Toast loading:', message);
  },
  promise: (promise, options) => {
    console.log('Toast promise:', promise);
  }
};
export { Toast };

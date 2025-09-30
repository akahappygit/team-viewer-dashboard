import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Bell,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Clock,
  Zap
} from 'lucide-react';
// Toast Context
const ToastContext = createContext();
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
// Toast types and configurations
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading',
  NETWORK: 'network',
  SYNC: 'sync'
};
export const TOAST_POSITIONS = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center'
};
const TOAST_CONFIG = {
  [TOAST_TYPES.SUCCESS]: {
    icon: CheckCircle,
    className: 'bg-green-500 text-white',
    duration: 4000
  },
  [TOAST_TYPES.ERROR]: {
    icon: AlertCircle,
    className: 'bg-red-500 text-white',
    duration: 6000
  },
  [TOAST_TYPES.WARNING]: {
    icon: AlertTriangle,
    className: 'bg-yellow-500 text-white',
    duration: 5000
  },
  [TOAST_TYPES.INFO]: {
    icon: Info,
    className: 'bg-blue-500 text-white',
    duration: 4000
  },
  [TOAST_TYPES.LOADING]: {
    icon: Clock,
    className: 'bg-gray-600 text-white',
    duration: null // Persistent until dismissed
  },
  [TOAST_TYPES.NETWORK]: {
    icon: Wifi,
    className: 'bg-purple-500 text-white',
    duration: 3000
  },
  [TOAST_TYPES.SYNC]: {
    icon: Zap,
    className: 'bg-indigo-500 text-white',
    duration: 3000
  }
};
// Individual Toast Component
const Toast = ({ toast, onDismiss, position }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG[TOAST_TYPES.INFO];
  const Icon = config.icon;
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (toast.duration / 100));
          if (newProgress <= 0) {
            handleDismiss();
            return 0;
          }
          return newProgress;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [toast.duration]);
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  };
  const getPositionClasses = () => {
    const baseClasses = 'fixed z-50';
    switch (position) {
      case TOAST_POSITIONS.TOP_RIGHT:
        return `${baseClasses} top-4 right-4`;
      case TOAST_POSITIONS.TOP_LEFT:
        return `${baseClasses} top-4 left-4`;
      case TOAST_POSITIONS.TOP_CENTER:
        return `${baseClasses} top-4 left-1/2 transform -translate-x-1/2`;
      case TOAST_POSITIONS.BOTTOM_RIGHT:
        return `${baseClasses} bottom-4 right-4`;
      case TOAST_POSITIONS.BOTTOM_LEFT:
        return `${baseClasses} bottom-4 left-4`;
      case TOAST_POSITIONS.BOTTOM_CENTER:
        return `${baseClasses} bottom-4 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  };
  const getAnimationVariants = () => {
    const isTop = position.includes('top');
    const isRight = position.includes('right');
    const isLeft = position.includes('left');
    const isCenter = position.includes('center');
    let x = 0;
    let y = 0;
    if (isRight) x = 100;
    if (isLeft) x = -100;
    if (isTop) y = -100;
    if (!isTop) y = 100;
    if (isCenter) x = 0;
    return {
      initial: { opacity: 0, x, y, scale: 0.8 },
      animate: { opacity: 1, x: 0, y: 0, scale: 1 },
      exit: { opacity: 0, x, y, scale: 0.8 }
    };
  };
  return (
    <motion.div
      className={getPositionClasses()}
      variants={getAnimationVariants()}
      initial="initial"
      animate={isVisible ? "animate" : "exit"}
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className={`
        relative overflow-hidden rounded-lg shadow-lg min-w-[320px] max-w-md
        ${config.className}
        ${toast.className || ''}
      `}>
        {}
        {toast.duration && toast.duration > 0 && (
          <div className="absolute top-0 left-0 h-1 bg-white/30 w-full">
            <motion.div
              className="h-full bg-white"
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}
        <div className="flex items-start gap-3 p-4">
          {}
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === TOAST_TYPES.LOADING ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            ) : (
              <Icon className="w-5 h-5" />
            )}
          </div>
          {}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="font-semibold text-sm mb-1">
                {toast.title}
              </h4>
            )}
            <p className="text-sm opacity-90">
              {toast.message}
            </p>
            {}
            {toast.actions && toast.actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {toast.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.onClick();
                      if (action.dismissOnClick !== false) {
                        handleDismiss();
                      }
                    }}
                    className="px-3 py-1 text-xs font-medium bg-white/20 hover:bg-white/30 rounded transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {}
          {toast.dismissible !== false && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
// Toast Container Component
const ToastContainer = ({ toasts, position, onDismiss }) => {
  const getContainerClasses = () => {
    const baseClasses = 'fixed z-50 pointer-events-none';
    switch (position) {
      case TOAST_POSITIONS.TOP_RIGHT:
        return `${baseClasses} top-4 right-4 space-y-2`;
      case TOAST_POSITIONS.TOP_LEFT:
        return `${baseClasses} top-4 left-4 space-y-2`;
      case TOAST_POSITIONS.TOP_CENTER:
        return `${baseClasses} top-4 left-1/2 transform -translate-x-1/2 space-y-2`;
      case TOAST_POSITIONS.BOTTOM_RIGHT:
        return `${baseClasses} bottom-4 right-4 space-y-2`;
      case TOAST_POSITIONS.BOTTOM_LEFT:
        return `${baseClasses} bottom-4 left-4 space-y-2`;
      case TOAST_POSITIONS.BOTTOM_CENTER:
        return `${baseClasses} bottom-4 left-1/2 transform -translate-x-1/2 space-y-2`;
      default:
        return `${baseClasses} top-4 right-4 space-y-2`;
    }
  };
  return (
    <div className={getContainerClasses()}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              toast={toast}
              position={position}
              onDismiss={onDismiss}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
// Toast Provider Component
export const ToastProvider = ({ 
  children, 
  position = TOAST_POSITIONS.TOP_RIGHT,
  maxToasts = 5 
}) => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast = {
      id,
      type: TOAST_TYPES.INFO,
      dismissible: true,
      ...toast,
      createdAt: new Date().toISOString()
    };
    setToasts(prev => {
      const updated = [newToast, ...prev];
      // Limit number of toasts
      return updated.slice(0, maxToasts);
    });
    return id;
  }, [maxToasts]);
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  const updateToast = useCallback((id, updates) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  }, []);
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);
  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return addToast({
      type: TOAST_TYPES.SUCCESS,
      message,
      ...options
    });
  }, [addToast]);
  const error = useCallback((message, options = {}) => {
    return addToast({
      type: TOAST_TYPES.ERROR,
      message,
      ...options
    });
  }, [addToast]);
  const warning = useCallback((message, options = {}) => {
    return addToast({
      type: TOAST_TYPES.WARNING,
      message,
      ...options
    });
  }, [addToast]);
  const info = useCallback((message, options = {}) => {
    return addToast({
      type: TOAST_TYPES.INFO,
      message,
      ...options
    });
  }, [addToast]);
  const loading = useCallback((message, options = {}) => {
    return addToast({
      type: TOAST_TYPES.LOADING,
      message,
      dismissible: false,
      duration: null,
      ...options
    });
  }, [addToast]);
  const network = useCallback((message, options = {}) => {
    return addToast({
      type: TOAST_TYPES.NETWORK,
      message,
      ...options
    });
  }, [addToast]);
  const sync = useCallback((message, options = {}) => {
    return addToast({
      type: TOAST_TYPES.SYNC,
      message,
      ...options
    });
  }, [addToast]);
  const contextValue = {
    toasts,
    addToast,
    removeToast,
    updateToast,
    clearToasts,
    success,
    error,
    warning,
    info,
    loading,
    network,
    sync
  };
  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts}
        position={position}
        onDismiss={removeToast}
      />
    </ToastContext.Provider>
  );
};
// Network Status Toast Hook
export const useNetworkToasts = () => {
  const { network, removeToast } = useToast();
  const [networkToastId, setNetworkToastId] = useState(null);
  useEffect(() => {
    const handleOnline = () => {
      if (networkToastId) {
        removeToast(networkToastId);
        setNetworkToastId(null);
      }
      const id = network('Back online! All features are available.', {
        type: TOAST_TYPES.SUCCESS,
        duration: 3000
      });
    };
    const handleOffline = () => {
      const id = network('You\'re offline. Some features may be limited.', {
        type: TOAST_TYPES.WARNING,
        duration: null,
        dismissible: false,
        actions: [
          {
            label: 'Retry',
            onClick: () => window.location.reload()
          }
        ]
      });
      setNetworkToastId(id);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [network, removeToast, networkToastId]);
};
// Sync Status Toast Hook
export const useSyncToasts = () => {
  const { sync, loading, success, error, updateToast } = useToast();
  const showSyncStart = useCallback((message = 'Syncing data...') => {
    return loading(message, {
      type: TOAST_TYPES.SYNC
    });
  }, [loading]);
  const showSyncSuccess = useCallback((toastId, message = 'Data synced successfully') => {
    updateToast(toastId, {
      type: TOAST_TYPES.SUCCESS,
      message,
      duration: 3000,
      dismissible: true
    });
  }, [updateToast]);
  const showSyncError = useCallback((toastId, message = 'Sync failed') => {
    updateToast(toastId, {
      type: TOAST_TYPES.ERROR,
      message,
      duration: 5000,
      dismissible: true,
      actions: [
        {
          label: 'Retry',
          onClick: () => {
            // Implement retry logic
          }
        }
      ]
    });
  }, [updateToast]);
  return {
    showSyncStart,
    showSyncSuccess,
    showSyncError
  };
};
export default ToastProvider;

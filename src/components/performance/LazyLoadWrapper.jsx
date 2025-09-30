import React, { Suspense, lazy, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
// Loading component with skeleton animation
const LoadingFallback = ({ 
  height = '200px', 
  showSpinner = true, 
  message = 'Loading...',
  variant = 'default' 
}) => {
  const skeletonVariants = {
    pulse: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  if (variant === 'skeleton') {
    return (
      <div className="space-y-4 p-4" style={{ minHeight: height }}>
        <motion.div
          variants={skeletonVariants}
          animate="pulse"
          className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"
        />
        <motion.div
          variants={skeletonVariants}
          animate="pulse"
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"
        />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              variants={skeletonVariants}
              animate="pulse"
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8"
      style={{ minHeight: height }}
    >
      {showSpinner && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 className="w-8 h-8 text-blue-500" />
        </motion.div>
      )}
      <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
    </motion.div>
  );
};
// Error boundary component for lazy loaded components
class LazyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
            Failed to load component
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm text-center mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onRetry) {
                this.props.onRetry();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </motion.div>
      );
    }
    return this.props.children;
  }
}
// Main lazy load wrapper component
const LazyLoadWrapper = ({
  importFunc,
  fallback,
  errorFallback,
  height = '200px',
  loadingVariant = 'default',
  loadingMessage = 'Loading component...',
  retryOnError = true,
  preload = false,
  children,
  ...props
}) => {
  const [LazyComponent, setLazyComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  // Preload component if specified
  useEffect(() => {
    if (preload && importFunc) {
      importFunc().catch(console.error);
    }
  }, [preload, importFunc]);
  // Create lazy component
  useEffect(() => {
    if (importFunc && !LazyComponent) {
      try {
        const Component = lazy(importFunc);
        setLazyComponent(() => Component);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    }
  }, [importFunc, LazyComponent, retryCount]);
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setLazyComponent(null);
    setRetryCount(prev => prev + 1);
  };
  // If children are provided, wrap them in lazy loading logic
  if (children) {
    return (
      <LazyErrorBoundary onRetry={retryOnError ? handleRetry : undefined}>
        <Suspense
          fallback={
            fallback || (
              <LoadingFallback
                height={height}
                variant={loadingVariant}
                message={loadingMessage}
              />
            )
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key="lazy-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              {...props}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </LazyErrorBoundary>
    );
  }
  // Handle error state
  if (error) {
    if (errorFallback) {
      return errorFallback;
    }
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
      >
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
          Failed to load component
        </h3>
        <p className="text-red-600 dark:text-red-300 text-sm text-center mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        {retryOnError && (
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </motion.div>
    );
  }
  // Handle loading state
  if (isLoading || !LazyComponent) {
    return (
      fallback || (
        <LoadingFallback
          height={height}
          variant={loadingVariant}
          message={loadingMessage}
        />
      )
    );
  }
  // Render lazy component
  return (
    <LazyErrorBoundary onRetry={retryOnError ? handleRetry : undefined}>
      <Suspense
        fallback={
          fallback || (
            <LoadingFallback
              height={height}
              variant={loadingVariant}
              message={loadingMessage}
            />
          )
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="lazy-component"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LazyComponent {...props} />
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </LazyErrorBoundary>
  );
};
// Higher-order component for lazy loading
export const withLazyLoading = (importFunc, options = {}) => {
  return (props) => (
    <LazyLoadWrapper importFunc={importFunc} {...options} {...props} />
  );
};
// Hook for dynamic imports
export const useDynamicImport = (importFunc, dependencies = []) => {
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let isMounted = true;
    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        const module = await importFunc();
        if (isMounted) {
          setComponent(() => module.default || module);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };
    loadComponent();
    return () => {
      isMounted = false;
    };
  }, dependencies);
  return { component, loading, error };
};
// Preloader component for critical components
export const ComponentPreloader = ({ components = [] }) => {
  useEffect(() => {
    // Preload components in the background
    const preloadPromises = components.map(async (importFunc) => {
      try {
        await importFunc();
      } catch (error) {
        console.warn('Failed to preload component:', error);
      }
    });
    Promise.all(preloadPromises);
  }, [components]);
  return null;
};
export default LazyLoadWrapper;

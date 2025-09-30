import React, { Component, createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Bug, Home, Mail, Copy, Check } from 'lucide-react';
const ErrorContext = createContext();
export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorProvider');
  }
  return context;
};
export const ERROR_TYPES = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
};
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo
    });
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
    this.reportError(error, errorInfo);
  }
  reportError = (error, errorInfo) => {
    const errorReport = {
      id: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.props.userId || 'anonymous',
      retryCount: this.state.retryCount
    };
    // In a real app, send this to your error reporting service
    if (this.props.onError) {
      this.props.onError(errorReport);
    }
    // Store in localStorage for offline reporting
    try {
      const storedErrors = JSON.parse(localStorage.getItem('errorReports') || '[]');
      storedErrors.push(errorReport);
      // Keep only last 10 errors
      if (storedErrors.length > 10) {
        storedErrors.shift();
      }
      localStorage.setItem('errorReports', JSON.stringify(storedErrors));
    } catch (e) {
      console.warn('Failed to store error report:', e);
    }
  };
  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: prevState.retryCount + 1
    }));
  };
  handleReload = () => {
    window.location.reload();
  };
  copyErrorDetails = () => {
    const errorDetails = {
      id: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString()
    };
    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
  };
  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, level = 'component' } = this.props;
      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
          />
        );
      }
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          level={level}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          onCopyError={this.copyErrorDetails}
        />
      );
    }
    return this.props.children;
  }
}
// Default Error Fallback Component
const ErrorFallback = ({
  error,
  errorInfo,
  errorId,
  level = 'component',
  retryCount = 0,
  onRetry,
  onReload,
  onCopyError
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await onCopyError();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const isPageLevel = level === 'page';
  const isAppLevel = level === 'app';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-8 ${
        isAppLevel ? 'min-h-screen bg-gray-50 dark:bg-gray-900' : 'min-h-[400px] bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'
      }`}
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-center max-w-md"
      >
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className={`font-bold text-gray-900 dark:text-white mb-2 ${
            isAppLevel ? 'text-3xl' : 'text-xl'
          }`}>
            {isAppLevel ? 'Application Error' : isPageLevel ? 'Page Error' : 'Something went wrong'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {isAppLevel 
              ? 'The application encountered an unexpected error and needs to be reloaded.'
              : 'This component encountered an error and couldn\'t render properly.'
            }
          </p>
          {errorId && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Error ID: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{errorId}</code>
            </p>
          )}
        </div>
        <div className="space-y-3 mb-6">
          {!isAppLevel && retryCount < 3 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again {retryCount > 0 && `(${retryCount}/3)`}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReload}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </motion.button>
          {isAppLevel && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mx-auto"
            >
              <Home className="w-4 h-4" />
              Go Home
            </motion.button>
          )}
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="text-left">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-2"
            >
              <Bug className="w-4 h-4" />
              {showDetails ? 'Hide' : 'Show'} Error Details
            </button>
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-left overflow-auto max-h-60"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm">Error Details</h4>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong>Message:</strong>
                      <pre className="mt-1 text-red-600 dark:text-red-400 whitespace-pre-wrap">
                        {error?.message}
                      </pre>
                    </div>
                    {error?.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 text-gray-600 dark:text-gray-400 whitespace-pre-wrap text-xs">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                    {errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 text-gray-600 dark:text-gray-400 whitespace-pre-wrap text-xs">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If this problem persists, please{' '}
            <a
              href="mailto:support@teampulse.com"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              contact support
            </a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
// Error Provider for global error handling
export const ErrorProvider = ({ children, onError }) => {
  const [errors, setErrors] = useState([]);
  const addError = (error) => {
    const errorWithId = {
      ...error,
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    setErrors(prev => [...prev, errorWithId]);
    if (onError) {
      onError(errorWithId);
    }
    // Auto-remove error after 10 seconds for non-critical errors
    if (error.severity !== ERROR_SEVERITY.CRITICAL) {
      setTimeout(() => {
        removeError(errorWithId.id);
      }, 10000);
    }
  };
  const removeError = (errorId) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  };
  const clearErrors = () => {
    setErrors([]);
  };
  const contextValue = {
    errors,
    addError,
    removeError,
    clearErrors
  };
  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};
// Hook for handling async errors
export const useAsyncError = () => {
  const { addError } = useErrorHandler();
  const handleAsyncError = (error, context = {}) => {
    const errorType = determineErrorType(error);
    const severity = determineErrorSeverity(error);
    addError({
      type: errorType,
      severity,
      message: error.message,
      stack: error.stack,
      context,
      source: 'async'
    });
  };
  return handleAsyncError;
};
// Utility functions
const determineErrorType = (error) => {
  if (error.name === 'NetworkError' || error.message.includes('fetch')) {
    return ERROR_TYPES.NETWORK;
  }
  if (error.status === 401) {
    return ERROR_TYPES.AUTHENTICATION;
  }
  if (error.status === 403) {
    return ERROR_TYPES.AUTHORIZATION;
  }
  if (error.status === 404) {
    return ERROR_TYPES.NOT_FOUND;
  }
  if (error.status >= 500) {
    return ERROR_TYPES.SERVER;
  }
  if (error.status >= 400) {
    return ERROR_TYPES.CLIENT;
  }
  return ERROR_TYPES.UNKNOWN;
};
const determineErrorSeverity = (error) => {
  if (error.status >= 500 || error.name === 'ChunkLoadError') {
    return ERROR_SEVERITY.CRITICAL;
  }
  if (error.status === 401 || error.status === 403) {
    return ERROR_SEVERITY.HIGH;
  }
  if (error.status >= 400) {
    return ERROR_SEVERITY.MEDIUM;
  }
  return ERROR_SEVERITY.LOW;
};
// Specific Error Boundary Components
export const PageErrorBoundary = ({ children, ...props }) => (
  <ErrorBoundary level="page" {...props}>
    {children}
  </ErrorBoundary>
);
export const ComponentErrorBoundary = ({ children, ...props }) => (
  <ErrorBoundary level="component" {...props}>
    {children}
  </ErrorBoundary>
);
export const AppErrorBoundary = ({ children, ...props }) => (
  <ErrorBoundary level="app" {...props}>
    {children}
  </ErrorBoundary>
);
export default ErrorBoundary;
